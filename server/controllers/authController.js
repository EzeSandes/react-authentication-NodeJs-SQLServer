const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getConnection = require('../server');
const { customAlphabet } = require('nanoid');
const { ID_LENGTH, ID_ALPHABET, HASH_SALT, COOKIE_JWT } = require('../config');
const nanoid = customAlphabet(ID_ALPHABET, ID_LENGTH);

exports.signup = async (req, res) => {
  try {
    const { username } = req.body;
    let { password } = req.body;
    let userId = ''; // ID must be provided by the DB(SQL Server) but for this example, I use an npm package

    if (!username || !password)
      throw new Error(`Username or Password not provided`);

    const pool = await getConnection();

    // Hash the password before save it.
    password = await bcrypt.hash(password, HASH_SALT);

    //  Take care about the '' in username and password
    const result = await pool
      .request()
      .query(
        `INSERT INTO ${
          process.env.DB_USERNAME_TABLE
        }(id, username, password) VALUES ('${(userId =
          nanoid())}' ,'${username}', '${password}')`
      );

    if (!result) throw new Error('Sig up error. Please try again.');

    createSendToken({ id: userId, username }, res);
  } catch (err) {
    console.log(`⛔⛔⛔ SIGNUP: ${err.message}`);
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw new Error(`Please provide email and password`);

    const pool = await getConnection();

    //  Take care about the '' in username(VARCHAR)
    const result = await pool
      .request()
      .query(
        `SELECT * FROM ${process.env.DB_USERNAME_TABLE} WHERE username = '${username}';`
      );

    const user = result.recordset[0];

    if (!user || !(await correctPassword(password, user.password)))
      throw new Error('Incorrect username or password');
    // 401: Error for user not found

    createSendToken(user, res);
  } catch (err) {
    console.log(`⛔⛔⛔ LOGIN: ${err.message}`);
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;

  try {
    // 1) Getting token and check if it's there.
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookie.jwt) {
      token = req.cookie.jwt;
    }

    if (!token)
      res.status(401).json({
        status: 'fail',
        message: 'Token not valid. Please Log in again.',
      });

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Of course, possible errors must be caught and handled in the error functions handler.
    // This is only an example, so I'll not do it but of course, in a real application is a must.

    // 3) Check if user still exists
    const result = await (await getConnection())
      .request()
      .query(
        `SELECT * FROM ${process.env.DB_USERNAME_TABLE} WHERE id = '${decoded.id}'`
      );
    const currentUser = result.recordset[0];
    if (!currentUser) throw new Error('User not found');

    // 4) Check if user changed password after the token was issued
    // -- TO-DO

    // To access current user information in each request and templates (res.locals)
    req.user = currentUser;
    res.locals.user = currentUser;
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
  next();
};

/***************** AUTH CONTROLLER UTILITIES */
/******************************************* */
async function correctPassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, res) {
  const token = signToken(user.id);

  // Cookie to store the jwt for future to verify protected routes
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // To mS = D * Hs * min * mS
    httpOnly: true, // The browser will not access or modify the cookie
  };

  // Only will be send on an encrypted connection (https). In Production only we have encrypted connection
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie(COOKIE_JWT, token, cookieOptions);

  // Remove the password from the output
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
}

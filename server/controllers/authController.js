const bcrypt = require('bcryptjs');
const getConnection = require('../server');

exports.signup = async (req, res) => {
  try {
    const { username } = req.body;
    let { password } = req.body;

    if (!username || !password)
      throw new Error(`Username or Password not provided`);

    const pool = await getConnection();

    // Hash the password before save it.
    password = await bcrypt.hash(password, 12);

    //  Take care about the '' in username and password
    const result = await pool
      .request()
      .query(
        `INSERT INTO ${process.env.DB_USERNAME_TABLE}(username, password) VALUES ('${username}', '${password}')`
      );

    console.log(result);
    res.status(200).json({
      status: 'success',
      data: {
        username,
      },
    });
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
    console.log(result);
    const user = result.recordset[0];
    console.log('user:', user);

    if (!user || !(await correctPassword(password, user.password)))
      throw new Error('Incorrect username or password');
    // 401: Error for user not found

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    console.log(`⛔⛔⛔ LOGIN: ${err.message}`);
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

/***************** AUTH CONTROLLER UTILITIES */
/******************************************* */
async function correctPassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

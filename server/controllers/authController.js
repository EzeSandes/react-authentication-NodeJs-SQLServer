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
    console.log(password);

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
    //  Take care about the '' in username and password
    const result = await pool
      .request()
      .query(
        `SELECT id, username FROM ${process.env.DB_USERNAME_TABLE} WHERE username = '${username}' AND password = '${password}'`
      );

    if (!result.rowsAffected[0] || result.recordset[0].password !== password)
      throw new Error('Incorrect username or password');
    // 401: Error for user not found

    console.log(result);
    res.status(200).json({
      status: 'success',
      data: result.recordset[0],
      // data: result.recordset[0], // Send info of the user found
    });
  } catch (err) {
    console.log(`⛔⛔⛔ LOGIN: ${err.message}`);
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

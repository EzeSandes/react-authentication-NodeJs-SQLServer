const getConnection = require('../server');

exports.signup = async (req, res, next) => {
  const { username, password } = req.body;

  console.log(username, password);
  try {
    const pool = await getConnection();

    //  Take care about the '' in username and password
    const result = await pool
      .request()
      .query(
        `INSERT INTO ${process.env.DB_USERNAME_TABLE}(username, password) VALUES ('${username}', '${password}')`
      );

    console.log(result);
  } catch (err) {
    console.log(`⛔⛔⛔ SIGNUP: ${err.message}`);
  }
};
exports.login = async (req, res, next) => {};

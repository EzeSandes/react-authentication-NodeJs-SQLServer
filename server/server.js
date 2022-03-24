const sql = require('mssql');

// SERVER
const sqlSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(sqlSettings);
    if (!pool) throw new Error('Error trying to connect');

    return pool;
  } catch (err) {
    console.log(`⛔⛔⛔: ${err.message}`);
  }
}

module.exports = getConnection;

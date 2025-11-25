// backend/db.js
require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

async function getConnection() {
  try {
    if (pool && pool.connected) return pool;
    pool = await sql.connect(dbConfig);
    console.log('Conexión a SQL Server establecida ✅');
    return pool;
  } catch (err) {
    console.error('Error conectando a SQL Server:', err);
    throw err;
  }
}

module.exports = { sql, getConnection };

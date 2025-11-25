// backend/testconnection.js
const { getConnection } = require('./db');

async function test() {
  try {
    const pool = await getConnection();
    const r = await pool.request().query("SELECT TOP 1 1 AS ok");
    console.log('Test OK:', r.recordset);
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();

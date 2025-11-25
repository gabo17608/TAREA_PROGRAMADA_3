// backend/services/adminService.js
const { sql, getConnection } = require('../db');

async function loginAdmin(username, password) {
  const pool = await getConnection();
  const request = pool.request();
  request.input('inUsername', sql.NVarChar(100), username);
  request.input('inPassword', sql.NVarChar(100), password);
  request.output('outResultCode', sql.Int);
  request.output('outResultado', sql.Bit);

  const result = await request.execute('SP_LoginAdmin');
  return {
    outResultCode: result.output.outResultCode,
    outResultado: result.output.outResultado
  };
}

module.exports = { loginAdmin };

// backend/services/adminService.js
const { sql, getConnection } = require('../db');

async function loginAdmin(username, password) {
  console.log('Login SP params:', { username, password }); // ✅ depuración

  const pool = await getConnection();
  const request = pool.request();
  request.input('inUsername', sql.NVarChar(100), username.trim());
  request.input('inPassword', sql.NVarChar(100), password.trim());
  request.output('outResultCode', sql.Int);
  request.output('outResultado', sql.Bit);

  const result = await request.execute('SP_LoginAdmin');
  console.log('SP result:', result.output); // ✅ depuración
  return {
    outResultCode: result.output.outResultCode,
    outResultado: result.output.outResultado
  };
}


module.exports = { loginAdmin };

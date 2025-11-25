// backend/services/personasService.js
const { sql, getConnection } = require('../db');

async function callSP_BuscarPorPersona(valorDocumento) {
  const pool = await getConnection();
  const request = pool.request();
  request.input('inValorDocumentoId', sql.NVarChar(20), valorDocumento);
  request.output('outResultCode', sql.Int);
  request.output('outResultado', sql.Bit);

  const result = await request.execute('SP_BuscarPorPersona');
  // Si existe, SP devuelve recordset con propiedades
  return {
    outResultCode: result.output.outResultCode,
    outResultado: result.output.outResultado,
    recordset: result.recordset
  };
}

module.exports = { callSP_BuscarPorPersona };

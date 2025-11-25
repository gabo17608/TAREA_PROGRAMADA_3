// backend/services/pagosService.js
const { sql, getConnection } = require('../db');

async function callSP_ProcesarPagoInterfaz(facturaId, tipoMedioPagoId) {
  const pool = await getConnection();
  const request = pool.request();
  request.input('inFacturaId', sql.Int, facturaId);
  request.input('inTipoMedioPagoId', sql.Int, tipoMedioPagoId);
  request.output('outNumeroReferencia', sql.VarChar(50));
  request.output('outResultCode', sql.Int);

  const result = await request.execute('SP_ProcesarPagoInterfaz');

  return {
    outNumeroReferencia: result.output.outNumeroReferencia,
    outResultCode: result.output.outResultCode
  };
}

module.exports = { callSP_ProcesarPagoInterfaz };

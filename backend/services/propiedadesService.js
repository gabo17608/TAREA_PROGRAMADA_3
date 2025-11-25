// backend/services/propiedadesService.js
const { sql, getConnection } = require('../db');

async function callSP_BuscarPorPropiedad(numeroFinca) {
  const pool = await getConnection();
  const request = pool.request();
  request.input('inNumeroFinca', sql.NVarChar(20), numeroFinca);
  request.output('outResultCode', sql.Int);
  request.output('outResultado', sql.Bit);

  const result = await request.execute('SP_BuscarPorPropiedad');
  return {
    outResultCode: result.output.outResultCode,
    outResultado: result.output.outResultado
  };
}

async function callSP_ObtenerInfoPropiedad(numeroFinca) {
  const pool = await getConnection();
  const request = pool.request();
  request.input('inNumeroFinca', sql.NVarChar(20), numeroFinca);
  request.output('outResultCode', sql.Int);

  const result = await request.execute('SP_ObtenerInfoPropiedad');
  // SP_ObtenerInfoPropiedad devuelve 3 SELECTs -> recordsets[0..2]
  return {
    outResultCode: result.output.outResultCode,
    recordsets: result.recordsets
  };
}

module.exports = { callSP_BuscarPorPropiedad, callSP_ObtenerInfoPropiedad };

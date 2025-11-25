// backend/controllers/propiedadesController.js
const propiedadesService = require('../services/propiedadesService');

async function buscarPorPropiedad(req, res) {
  try {
    const numeroFinca = req.params.numeroFinca;
    if (!numeroFinca) return res.status(400).json({ success:false, message:'numeroFinca requerido' });

    const result = await propiedadesService.callSP_BuscarPorPropiedad(numeroFinca);
    // result: { outResultCode, outResultado }
    return res.json({ success: result.outResultCode === 0, exists: result.outResultado === 1 });
  } catch (err) {
    console.error('Error buscarPorPropiedad:', err);
    res.status(500).json({ success:false, message: err.message });
  }
}

async function obtenerInfoPropiedad(req, res) {
  try {
    const numeroFinca = req.params.numeroFinca;
    if (!numeroFinca) return res.status(400).json({ success:false, message:'numeroFinca requerido' });

    const result = await propiedadesService.callSP_ObtenerInfoPropiedad(numeroFinca);
    // result: { outResultCode, recordsets: [propiedadInfo, personas, facturasPendientes] }
    if (result.outResultCode !== 0) return res.status(400).json({ success:false, outResultCode: result.outResultCode });

    const recordsets = result.recordsets || [];
    const propiedadInfo = recordsets[0] || [];
    const personas = recordsets[1] || [];
    const facturasPendientes = recordsets[2] || [];

    return res.json({
      success: true,
      propiedad: propiedadInfo.length ? propiedadInfo[0] : null,
      personas,
      facturasPendientes
    });
  } catch (err) {
    console.error('Error obtenerInfoPropiedad:', err);
    res.status(500).json({ success:false, message: err.message });
  }
}

module.exports = { buscarPorPropiedad, obtenerInfoPropiedad };

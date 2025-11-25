// backend/controllers/personasController.js
const personasService = require('../services/personasService');

async function buscarPorPersona(req, res) {
  try {
    const documento = req.params.documento;
    if (!documento) return res.status(400).json({ success:false, message:'documento requerido' });

    const result = await personasService.callSP_BuscarPorPersona(documento);
    if (result.outResultCode !== 0) return res.status(400).json({ success:false, outResultCode: result.outResultCode });

    return res.json({ success: true, propiedades: result.recordset || [] });
  } catch (err) {
    console.error('Error buscarPorPersona:', err);
    res.status(500).json({ success:false, message: err.message });
  }
}

module.exports = { buscarPorPersona };

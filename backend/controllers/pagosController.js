// backend/controllers/pagosController.js
const pagosService = require('../services/pagosService');

async function pagarFacturaInterfaz(req, res) {
  try {
    const { facturaId, tipoMedioPagoId } = req.body;
    if (!facturaId || !tipoMedioPagoId) return res.status(400).json({ success:false, message:'facturaId y tipoMedioPagoId son obligatorios' });

    const result = await pagosService.callSP_ProcesarPagoInterfaz(facturaId, tipoMedioPagoId);
    const outCode = result.outResultCode;

    if (outCode === 0) {
      return res.json({ success: true, numeroReferencia: result.outNumeroReferencia });
    } else {
      return res.status(400).json({ success:false, outResultCode: outCode });
    }
  } catch (err) {
    console.error('Error pagarFacturaInterfaz:', err);
    res.status(500).json({ success:false, message: err.message });
  }
}

module.exports = { pagarFacturaInterfaz };

const pagosService = require('../services/pagosService');

async function pagarFacturaInterfaz(req, res) {
  try {
    console.log('📥 Llega petición POST a /pagos/pagar con body:', req.body);

    const { facturaId, tipoMedioPagoId } = req.body;
    if (!facturaId || !tipoMedioPagoId) {
      console.warn('⚠️ facturaId o tipoMedioPagoId faltan en la petición');
      return res.status(400).json({ success:false, message:'facturaId y tipoMedioPagoId son obligatorios' });
    }

    const result = await pagosService.callSP_ProcesarPagoInterfaz(facturaId, tipoMedioPagoId);
    const outCode = result.outResultCode;

    if (outCode === 0) {
      console.log('✅ Pago procesado correctamente, númeroReferencia:', result.outNumeroReferencia);
      return res.json({ success: true, numeroReferencia: result.outNumeroReferencia });
    } else {
      console.error('❌ Error en SP, outResultCode:', outCode);
      return res.status(400).json({ success:false, outResultCode: outCode });
    }

  } catch (err) {
    console.error('❌ Error pagarFacturaInterfaz:', err);
    res.status(500).json({ success:false, message: err.message });
  }
}

module.exports = { pagarFacturaInterfaz };

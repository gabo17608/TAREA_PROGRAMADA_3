document.addEventListener('DOMContentLoaded', () => {
  const btnPagar = document.getElementById('btnPagar');
  const mensaje = document.getElementById('mensaje');
  const volverBtn = document.getElementById('volverBtn');

  let tipoMedioPagoId = null;
  document.querySelectorAll('.medio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tipoMedioPagoId = btn.dataset.id;
      document.querySelectorAll('.medio-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Obtener FacturaId y numeroFinca desde URL
  const urlParams = new URLSearchParams(window.location.search);
  const facturaId = urlParams.get('facturaId');
  const numeroFinca = urlParams.get('numeroFinca');

  // Configurar el botón "Volver" para regresar a detallePropiedad
  if (numeroFinca) {
    volverBtn.href = `detallePropiedad.html?numeroFinca=${numeroFinca}`;
  }

  btnPagar.addEventListener('click', async () => {
    if (!facturaId) {
      mensaje.textContent = 'No se encontró la factura.';
      return;
    }
    if (!tipoMedioPagoId) {
      mensaje.textContent = 'Debe seleccionar un método de pago.';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/pagos/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facturaId, tipoMedioPagoId })
      });

      const data = await response.json();

      if (data.success) {
        mensaje.textContent = `Pago simulado exitoso! Número de referencia: ${data.numeroReferencia}`;
        btnPagar.disabled = true;
        document.querySelectorAll('.medio-btn').forEach(b => b.disabled = true);
        // Redirigir a detallePropiedad con el mismo numeroFinca
        setTimeout(() => {
          window.location.href = `detallePropiedad.html?numeroFinca=${numeroFinca}`;
        }, 2000);
      } else {
        mensaje.textContent = `Error al procesar pago: ${data.message || data.outResultCode}`;
      }
    } catch (err) {
      mensaje.textContent = `Error de conexión: ${err.message}`;
    }
  });
});

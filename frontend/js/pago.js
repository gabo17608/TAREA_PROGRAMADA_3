import { post } from "./api.js";

document.addEventListener('DOMContentLoaded', () => {
  const btnPagar = document.getElementById('btnPagar');
  const mensaje = document.getElementById('mensaje');
  const notificacion = document.getElementById('notificacion');

  let tipoMedioPagoId = null;

  document.querySelectorAll('.medio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tipoMedioPagoId = btn.dataset.id;
      document.querySelectorAll('.medio-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const facturaId = urlParams.get('facturaId');

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
      const data = await post('/pagos/pagar', { facturaId, tipoMedioPagoId });

      if (data.success) {
        // Mostrar notificación
        notificacion.textContent = `Pago simulado exitoso! Número de referencia: ${data.data.numeroReferencia}`;
        notificacion.style.display = 'block';

        btnPagar.disabled = true;
        document.querySelectorAll('.medio-btn').forEach(b => b.disabled = true);

        // Ocultar notificación y redirigir al dashboard después de 2 seg
        setTimeout(() => {
          notificacion.style.display = 'none';
          window.location.href = 'dashboard.html';
        }, 2000);

      } else {
        mensaje.textContent = `Error al procesar pago: ${data.error || data.data?.outResultCode}`;
      }

    } catch (err) {
      mensaje.textContent = `Error de conexión: ${err.message}`;
      console.error('❌ Pago error:', err);
    }
  });
});

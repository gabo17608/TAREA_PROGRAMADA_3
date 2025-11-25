import { get } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
const resultadosDiv = document.getElementById("detallePropiedad");
const spinner = document.getElementById("spinnerDetalle");

// Suponemos que se pasa numeroFinca por query string, ej: detallePropiedad.html?numeroFinca=1234
const params = new URLSearchParams(window.location.search);
const numeroFinca = params.get("numeroFinca");
if (!numeroFinca) {
    resultadosDiv.innerHTML = "<p class='error'>No se proporcionó número de finca.</p>";
    return;
}

spinner.style.display = "block";
const res = await get(`/propiedades/info/${numeroFinca}`);
spinner.style.display = "none";

if (res.success && res.data && res.data.propiedad) {
    resultadosDiv.innerHTML = `
        <h3>${res.data.propiedad.nombre}</h3>
        <p>Dirección: ${res.data.propiedad.direccion}</p>
        <h4>Personas Asociadas:</h4>
        <ul>
            ${res.data.personas.map(p => `<li>${p.nombre} - ${p.documento}</li>`).join('')}
        </ul>
        <h4>Facturas Pendientes:</h4>
        <ul>
            ${res.data.facturasPendientes.map(f => `<li>${f.descripcion} - ₡${f.monto}</li>`).join('')}
        </ul>
    `;
} else {
    resultadosDiv.innerHTML = `<p class="error">${res.error || "No se encontraron detalles de la propiedad."}</p>`;
}


});

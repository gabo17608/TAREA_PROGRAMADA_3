import { get } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("buscarFincaForm");
const resultadosDiv = document.getElementById("resultados");
const spinner = document.getElementById("spinner");


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultadosDiv.innerHTML = "";
    spinner.style.display = "block";

    const numeroFinca = document.getElementById("numeroFinca").value.trim();
    if (!numeroFinca) {
        alert("Ingrese un número de finca.");
        spinner.style.display = "none";
        return;
    }

    const res = await get(`/propiedades/buscar/${numeroFinca}`);
    spinner.style.display = "none";

    if (res.success && res.data) {
        if (res.data.propiedad) {
            resultadosDiv.innerHTML = `
                <h3>Propiedad: ${res.data.propiedad.nombre}</h3>
                <p>Dirección: ${res.data.propiedad.direccion}</p>
                <p>Propietario: ${res.data.propiedad.propietario}</p>
                <h4>Facturas Pendientes:</h4>
                <ul>
                    ${res.data.facturasPendientes.map(f => `<li>${f.descripcion} - ₡${f.monto}</li>`).join('')}
                </ul>
            `;
        } else {
            resultadosDiv.innerHTML = "<p class='error'>No se encontraron resultados.</p>";
        }
    } else {
        resultadosDiv.innerHTML = `<p class="error">${res.error || "Error al conectar con el servidor."}</p>`;
    }
});


});

import { get } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("buscarPersonaForm");
const resultadosDiv = document.getElementById("resultadosPersona");
const spinner = document.getElementById("spinnerPersona");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultadosDiv.innerHTML = "";
    spinner.style.display = "block";

    const documento = document.getElementById("documento").value.trim();
    if (!documento) {
        alert("Ingrese un número de documento.");
        spinner.style.display = "none";
        return;
    }

    const res = await get(`/personas/buscar/${documento}`);
    spinner.style.display = "none";

    if (res.success && res.data) {
        if (res.data.propiedades && res.data.propiedades.length > 0) {
            resultadosDiv.innerHTML = `
                <h4>Propiedades de la persona:</h4>
                <ul>
                    ${res.data.propiedades.map(p => `<li>${p.nombre} - ${p.direccion}</li>`).join('')}
                </ul>
            `;
        } else {
            resultadosDiv.innerHTML = "<p class='error'>No se encontraron propiedades.</p>";
        }
    } else {
        resultadosDiv.innerHTML = `<p class="error">${res.error || "Error al conectar con el servidor."}</p>`;
    }
});

});

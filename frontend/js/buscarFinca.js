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

        try {
            // Llamamos al endpoint que devuelve la info de la propiedad
            const res = await get(`/propiedades/info/${numeroFinca}`);
            spinner.style.display = "none";

            if (res.success && res.data && res.data.propiedad) {
                // Si existe, redirigimos a detallePropiedad
                window.location.href = `detallePropiedad.html?numeroFinca=${encodeURIComponent(numeroFinca)}`;
            } else {
                // Si no existe, mostramos mensaje de error
                resultadosDiv.classList.add("active");
                resultadosDiv.innerHTML = `<p class="error">No se encontraron resultados para "${numeroFinca}".</p>`;
            }
        } catch (err) {
            spinner.style.display = "none";
            resultadosDiv.classList.add("active");
            resultadosDiv.innerHTML = `<p class="error">Error al conectar con el servidor.</p>`;
            console.error("Error buscarFinca:", err);
        }
    });
});

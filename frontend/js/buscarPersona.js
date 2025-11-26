import { get } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("buscarPersonaForm");
    const resultadosDiv = document.getElementById("resultadosPersona");
    const spinner = document.getElementById("spinnerPersona");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        resultadosDiv.innerHTML = "";
        spinner.style.display = "block";

        const documento = document.getElementById("cedulaPersona").value.trim();
        if (!documento) {
            alert("Ingrese un número de documento.");
            spinner.style.display = "none";
            return;
        }

        try {
            const res = await get(`/personas/buscar/${documento}`);
            console.log("Respuesta del endpoint:", res);

            spinner.style.display = "none";

            if (res.success && res.data.propiedades && res.data.propiedades.length > 0) {
                const propiedades = res.data.propiedades;

                resultadosDiv.innerHTML = `
                    <h4>Propiedades de la persona:</h4>
                    <table class="tabla-propiedades">
                        <thead>
                            <tr>
                                <th>Finca</th>
                                <th>Fecha registro</th>
                                <th>Fecha asociación</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${propiedades.map((p, index) => 
                                `<tr>
                                    <td>${p.NumeroFinca}</td>
                                    <td>${new Date(p.FechaRegistro).toLocaleDateString()}</td>
                                    <td>${new Date(p.FechaAsociacion).toLocaleDateString()}</td>
                                    <td><button class="ver-detalle-btn medio-btn" data-index="${index}">Ver más detalles</button></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                `;

                // Agregar evento a cada botón
                document.querySelectorAll(".ver-detalle-btn").forEach((btn) => {
                    btn.addEventListener("click", () => {
                        const index = btn.getAttribute("data-index");
                        const numeroFinca = propiedades[index].NumeroFinca;
                        window.location.href = `detallePropiedad.html?numeroFinca=${encodeURIComponent(numeroFinca)}`;
                    });
                });

            } else {
                resultadosDiv.innerHTML = `<p class="error">No se encontraron propiedades para el documento "${documento}".</p>`;
            }

        } catch (err) {
            spinner.style.display = "none";
            resultadosDiv.innerHTML = `<p class="error">Error al conectar con el servidor.</p>`;
            console.error("Error buscarPersona:", err);
        }
    });
});

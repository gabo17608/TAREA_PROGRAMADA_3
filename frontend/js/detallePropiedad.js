import { get } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const resultadosDiv = document.getElementById("detallePropiedad");
    const spinner = document.getElementById("spinnerDetalle");

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
        const propiedad = res.data.propiedad;
        const personas = res.data.personas;
        const facturas = res.data.facturasPendientes;

        // Ordenar facturas por fecha de vencimiento (más antigua primero)
        facturas.sort((a,b) => new Date(a.FechaVencimiento) - new Date(b.FechaVencimiento));

        resultadosDiv.innerHTML = `
            <div class="info-block">
                <h3>Propiedad: ${propiedad.NumeroFinca}</h3>
                <p>Metros Cuadrados: ${propiedad.MetrosCuadrados}</p>
                <p>Tipo Uso: ${propiedad.TipoUso}</p>
                <p>Tipo Zona: ${propiedad.TipoZona}</p>
                <p>Valor Fiscal: ₡${propiedad.ValorFiscal}</p>
            </div>

            <div class="info-block">
                <h4>Personas Asociadas:</h4>
                <ul>
                    ${personas.length ? personas.map(p => `<li>${p.Nombre} - ${p.ValorDocumentoId}</li>`).join('') 
                    : "<li>No hay personas asociadas</li>"}
                </ul>
            </div>

            <div class="info-block">
                <h4>Facturas Pendientes:</h4>
                <ul>
                    ${facturas.length ? facturas.map((f, index) => 
                        `<li>
                            Factura #${f.FacturaId} - ₡${f.TotalAPagarFinal} (Vencida: ${f.DiasVencidos} días)
                            ${index === 0 ? `<button id="btnPagarFactura" data-facturaid="${f.FacturaId}" class="medio-btn" style="margin-left:10px;">Pagar esta factura</button>` : ""}
                        </li>`).join('') 
                    : "<li>No hay facturas pendientes</li>"}
                </ul>
            </div>
        `;

        // Agregar evento al botón de la factura más antigua
        const btnPagar = document.getElementById("btnPagarFactura");
        if(btnPagar){
            btnPagar.addEventListener("click", () => {
                const facturaId = btnPagar.dataset.facturaid;
                window.location.href = `pago.html?facturaId=${facturaId}`;
            });
        }

    } else {
        resultadosDiv.innerHTML = `<p class="error">${res.error || "No se encontraron detalles de la propiedad."}</p>`;
    }
});

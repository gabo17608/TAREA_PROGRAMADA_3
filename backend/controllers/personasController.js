const personasService = require('../services/personasService');

async function buscarPorPersona(req, res) {
    console.log("🔹 Llegó petición al backend:", req.params.documento);

    try {
        const documento = req.params.documento;
        if (!documento) {
            console.log("⚠ Documento vacío o no recibido");
            return res.status(400).json({ success:false, message:'documento requerido' });
        }

        console.log("📌 Llamando al SP con documento:", documento);
        const result = await personasService.callSP_BuscarPorPersona(documento);

        console.log("📌 Resultados del SP:", result);
        console.log("📌 Recordset recibido del SP:", result.recordset);

        if (result.outResultCode !== 0) {
            console.log("❌ SP devolvió error, outResultCode:", result.outResultCode);
            return res.status(400).json({ success:false, outResultCode: result.outResultCode });
        }

        // ⚡ Normalizamos los nombres de campos para frontend
        let propiedades = [];
        if (result.outResultado ) {
            if (result.recordset && result.recordset.length > 0) {
                console.log("✅ Recordset tiene datos, mapeando para frontend...");
                propiedades = result.recordset.map(p => ({
                    NumeroFinca: p.NumeroFinca,           // mssql suele convertir a minúsculas
                    FechaRegistro: p.FechaRegistro,
                    FechaAsociacion: p.fechaAsociacion
                }));
            } else {
                console.log("⚠ Recordset vacío aunque outResultado=1");
            }
        } else {
            console.log("⚠ Persona no encontrada, outResultado=0");
        }

        console.log("📤 Enviando al frontend:", propiedades);
        return res.json({ success: true, propiedades });

    } catch (err) {
        console.error('❌ Error buscarPorPersona:', err);
        res.status(500).json({ success:false, message: err.message });
    }
}

module.exports = { buscarPorPersona };

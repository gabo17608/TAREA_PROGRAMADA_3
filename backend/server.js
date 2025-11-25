// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sql, getConnection } = require("./db"); // Tu archivo db.js
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Carpeta pública

// -------------------- RUTA LOGIN.HTML --------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input("inUsername", sql.NVarChar, username);
        request.input("inPassword", sql.NVarChar, password);
        request.input("inPostInIP", sql.NVarChar, req.ip || "127.0.0.1");
        request.output("outResultCode", sql.Int);
        request.output("outUserId", sql.Int);

        const result = await request.execute("SP_Login_Usuario");

        // Intentar leer OUTPUT primero
        let resultCode = request.parameters.outResultCode.value;
        let userId = request.parameters.outUserId.value;

        // Si OUTPUT viene null, usar SELECT final del SP
        if (resultCode == null && result.recordset && result.recordset.length > 0) {
            resultCode = result.recordset[0].ResultCode;
            userId = result.recordset[0].UserId;
        }

        if (resultCode === 0) {
            res.json({ success: true, userId });
        } else {
            res.json({ success: false, errorCode: resultCode || "Desconocido" });
        }
    } catch (err) {
        console.error("Error en /login:", err);
        res.status(500).json({ success: false, errorCode: 50008, message: "Error de conexión o base de datos" });
    }
});

// -------------------- LOGOUT --------------------
app.post("/logout", async (req, res) => {
    const { userId, ip } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, error: "No se proporcionó userId" });
    }

    try {
        const pool = await getConnection();
        const request = pool.request();
        request.input("inIdUsuario", sql.Int, userId);
        request.input("inPostInIP", sql.NVarChar, ip || req.ip || "127.0.0.1");
        request.output("outResultCode", sql.Int);

        await request.execute("SP_Logout");

        const resultCode = request.parameters.outResultCode.value;
        if (resultCode === 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, errorCode: resultCode || "Desconocido" });
        }
    } catch (err) {
        console.error("Error en /logout:", err);
        res.status(500).json({ success: false, errorCode: 50008, message: "Error de conexión o base de datos" });
    }
});

// -------------------- EMPLEADOS --------------------

// LISTAR EMPLEADOS (CON FILTRO OPCIONAL)
app.get("/empleados/listar", async (req, res) => {
    try {
        const pool = await getConnection();
        const request = pool.request();
        const filtro = req.query.filtro || null;
        const idUsuario = 1; // luego se puede pasar dinámico
        const ip = req.ip || "127.0.0.1";

        request.input("inFiltro", sql.NVarChar, filtro);
        request.input("inIdUsuario", sql.Int, idUsuario);
        request.input("inPostInIP", sql.NVarChar, ip);
        request.output("outResultCode", sql.Int);

        const result = await request.execute("SP_ListarEmpleados");
        const empleados = result.recordset || [];
        const resultCode = result.output.outResultCode ?? 0;

        res.json({ success: resultCode === 0, empleados });
    } catch (err) {
        console.error("Error en /empleados/listar:", err);
        res.status(500).json({ success: false, message: "Error al cargar empleados desde la base de datos" });
    }
});

// CONSULTAR EMPLEADO
app.post("/empleado/consultar", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ exists: false, message: "No se proporcionó ID" });

    try {
        const pool = await getConnection();
        const request = pool.request();
        const idUsuario = 1;
        const ip = req.ip || "127.0.0.1";

        request.input("inId", sql.Int, id);
        request.input("inIdUsuario", sql.Int, idUsuario);
        request.input("inPostInIP", sql.NVarChar, ip);
        request.output("outResultCode", sql.Int);

        await request.execute("SP_ConsultarEmpleado");

        const resultCode = request.parameters.outResultCode.value;

        if (resultCode === 0) {
            const result = await pool.request()
                .input("Id", sql.Int, id)
                .query(`SELECT E.Id, E.ValorDocumentoIdentidad, E.Nombre, E.IdPuesto 
                        FROM Empleado E 
                        WHERE E.Id = @Id`);

            if (result.recordset.length > 0) {
                const emp = result.recordset[0];
                res.json({ exists: true, ...emp });
            } else {
                res.json({ exists: false });
            }
        } else {
            res.json({ exists: false, errorCode: resultCode });
        }
    } catch (err) {
        console.error("Error en /empleado/consultar:", err);
        res.status(500).json({ exists: false, message: "Error de base de datos" });
    }
});

// ACTUALIZAR EMPLEADO
app.post("/empleado/actualizar", async (req, res) => {
    const { id, cedula, nombre, idPuesto } = req.body;
    if (!id || !cedula || !nombre || !idPuesto)
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });

    try {
        const pool = await getConnection();
        const request = pool.request();
        const idUsuario = 1;
        const ip = req.ip || "127.0.0.1";

        request.input("inId", sql.Int, id);
        request.input("inNuevoValorDocumentoIdentidad", sql.NVarChar, cedula);
        request.input("inNuevoNombre", sql.NVarChar, nombre);
        request.input("inNuevoIdPuesto", sql.Int, idPuesto);
        request.input("inIdUsuario", sql.Int, idUsuario);
        request.input("inPostInIP", sql.NVarChar, ip);
        request.output("outResultCode", sql.Int);

        await request.execute("SP_UpdateEmpleado");

        const resultCode = request.parameters.outResultCode.value;
        if (resultCode === 0)
            res.json({ success: true });
        else
            res.json({ success: false, errorCode: resultCode });
    } catch (err) {
        console.error("Error en /empleado/actualizar:", err);
        res.status(500).json({ success: false, message: "Error de base de datos" });
    }
});

// INSERTAR EMPLEADO
app.post("/empleado/insertar", async (req, res) => {
    const { valorDocumento, nombre, idPuesto, fechaContratacion } = req.body;
    try {
        const pool = await getConnection();
        const request = pool.request();
        const idUsuario = 1; // puedes reemplazar por el user logueado
        const ip = req.ip || "127.0.0.1";

        request.input("inValorDocumentoIdentidad", sql.NVarChar, valorDocumento);
        request.input("inNombre", sql.NVarChar, nombre);
        request.input("inIdPuesto", sql.Int, idPuesto);
        request.input("inFechaContratacion", sql.Date, fechaContratacion);
        request.input("inIdUsuario", sql.Int, idUsuario);
        request.input("inPostInIP", sql.NVarChar, ip);
        request.output("outResultCode", sql.Int);

        const result = await request.execute("SP_InsertarEmpleado");

        let resultCode = request.parameters.outResultCode.value;
        if (resultCode == null && result.recordset?.length > 0) {
            resultCode = result.recordset[0].ResultCode;
        }

        if (resultCode === 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, errorCode: resultCode });
        }
    } catch (err) {
        console.error("Error en /empleado/insertar:", err);
        res.status(500).json({ success: false, message: "Error este usuario ya existe" });
    }
});


// ELIMINAR EMPLEADO
app.post("/empleado/eliminar", async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) return res.status(400).json({ success: false, message: "No se proporcionó cédula" });

    try {
        const pool = await getConnection();
        const request = pool.request();
        const idUsuario = 1; // o el id de sesión
        const ip = req.ip || "127.0.0.1";

        // Parámetros del SP
        request.input("inCedula", sql.NVarChar, cedula);
        request.input("inRespuesta", sql.Bit, 1); // 1 = eliminar
        request.input("inIdUsuario", sql.Int, idUsuario);
        request.input("inPostInIP", sql.NVarChar, ip);
        request.output("outResultCode", sql.Int);

        const result = await request.execute("SP_DeleteEmpleado");

        // Ahora obtenemos correctamente el valor del OUTPUT
        const resultCode = result.output.outResultCode;
        console.log("Código devuelto por SP_DeleteEmpleado:", resultCode);

        // Manejo de códigos devueltos
        switch (resultCode) {
            case 200:
                return res.json({ success: true, message: "Empleado eliminado correctamente" });
            case 404:
                return res.json({ success: false, message: "Empleado no existe" });
            case 0:
                return res.json({ success: false, message: "Operación cancelada" });
            case 50008:
                return res.json({ success: false, message: "Error interno en el SP" });
            default:
                return res.json({ success: false, message: "Error desconocido", errorCode: resultCode });
        }

    } catch (err) {
        console.error("Error en /empleado/eliminar:", err);
        return res.status(500).json({ success: false, message: "Error interno del servidor", error: err.message });
    }
});

// -------------------- MOVIMIENTOS --------------------

// LISTAR MOVIMIENTOS DE UN EMPLEADO
app.get("/movimientos/listar", async (req, res) => {
    const empleadoId = parseInt(req.query.empleadoId);
    if (!empleadoId) return res.status(400).json({ success: false, message: "No se proporcionó empleadoId" });

    try {
        const pool = await getConnection();
        const request = pool.request();

        const idUsuario = 1; // cambiar por usuario logueado
        const ip = req.ip || "127.0.0.1";

        request.input("inId", sql.Int, empleadoId);
        request.input("inIdUsuario", sql.Int, idUsuario);
        request.input("inPostInIP", sql.NVarChar, ip);
        request.output("outResultCode", sql.Int);

        const resultSP = await request.execute("SP_ListarMovimientos");
        const movimientos = resultSP.recordsets[0] || [];
        const outResultCode = resultSP.output.outResultCode ?? 0;

        // Obtener datos del empleado desde los movimientos o desde tabla Empleado
        let datosEmpleado = {};
        if (movimientos.length > 0) {
            const mov = movimientos[0];
            datosEmpleado = {
                ValorDocumentoIdentidad: mov.ValorDocumentoIdentidad || "",
                NombreEmpleado: mov.NombreEmpleado || "",
                SaldoActual: mov.NuevoSaldo || 0
            };
        } else {
            const empResult = await pool.request()
              .input("id", sql.Int, empleadoId)
              .query("SELECT ValorDocumentoIdentidad, Nombre, SaldoVacaciones FROM Empleado WHERE Id = @id");

            const emp = empResult.recordset[0] || {};
            datosEmpleado = {
                ValorDocumentoIdentidad: emp.ValorDocumentoIdentidad || "",
                NombreEmpleado: emp.Nombre || "",
                SaldoActual: emp.SaldoVacaciones || 0
            };
        }

        res.json({
            success: outResultCode === 0,
            datosEmpleado,
            movimientos
        });

    } catch (err) {
        console.error("Error en /movimientos/listar:", err.message, err.stack);
        res.status(500).json({ success: false, message: "Error al obtener movimientos", error: err.message });
    }
});

// LISTAR TIPOS DE MOVIMIENTO
app.get("/tiposmovimiento/listar", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT Id, Nombre FROM TipoMovimiento ORDER BY Id");
        res.json({ success: true, tipos: result.recordset });
    } catch (err) {
        console.error("Error en /tiposmovimiento/listar:", err);
        res.status(500).json({ success: false, tipos: [] });
    }
});

// AGREGAR MOVIMIENTO A UN EMPLEADO
app.post("/movimientos/agregar", async (req, res) => {
    try {
        const { empleadoId, idTipoMovimiento, monto } = req.body;

        if (!empleadoId || !idTipoMovimiento || monto === undefined) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
        }

        const pool = await getConnection();
        const request = pool.request();

        const idUsuario = 1; // cambiar por usuario logueado
        const ip = req.ip || "127.0.0.1";
        const postTime = new Date();
        const fecha = new Date().toISOString().split('T')[0]; // Solo fecha para el SP

        request.input("inId", sql.Int, empleadoId);
        request.input("inIdTipoMovimiento", sql.Int, idTipoMovimiento);
        request.input("inFecha", sql.Date, fecha);
        request.input("inMonto", sql.Decimal(10, 2), monto);
        request.input("inIdUsuario", sql.Int, idUsuario);
        request.input("inPostInIP", sql.NVarChar, ip);
        request.input("inPostTime", sql.DateTime, postTime);
        request.output("outResultCode", sql.Int);

        const resultSP = await request.execute("SP_InsertarMovimiento");
        const outResultCode = resultSP.output.outResultCode;

        if (outResultCode === 50011) {
            return res.status(400).json({
                success: false,
                message: "No se puede aplicar el movimiento: saldo insuficiente",
                errorCode: outResultCode
            });
        } else if (outResultCode !== 0) {
            return res.status(400).json({
                success: false,
                message: `Error al insertar movimiento - Código: ${outResultCode}`
            });
        }

        // Obtener el último movimiento insertado con nombre correcto del tipo
        const movResult = await pool.request()
            .input("empleadoId", sql.Int, empleadoId)
            .query(`
                SELECT TOP 1 
                    M.Id AS MovimientoId,
                    M.Fecha,
                    TM.Nombre AS NombreTipoMovimiento,
                    M.Monto,
                    M.NuevoSaldo,
                    U.Nombre AS NombreUsuario,
                    M.PostInIP,
                    M.PostTime
                FROM Movimiento M
                INNER JOIN TipoMovimiento TM ON M.IdTipoMovimiento = TM.Id
                INNER JOIN Usuario U ON M.IdPostByUser = U.Id
                WHERE M.IdEmpleado = @empleadoId
                ORDER BY M.PostTime DESC
            `);

        res.json({
            success: true,
            message: "Movimiento agregado correctamente",
            movimiento: movResult.recordset[0] || null
        });

    } catch (err) {
        console.error("Error en /movimientos/agregar:", err.message, err.stack);
        res.status(500).json({ success: false, message: "Error al agregar movimiento", error: err.message });
    }
});

// -------------------- INICIAR SERVIDOR --------------------
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

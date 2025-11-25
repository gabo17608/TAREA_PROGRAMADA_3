// backend/db.js
const sql = require("mssql");

const dbConfig = {
  user: "empleado_user",       // tu usuario de SQL
  password: "12345Segura",     // tu contraseña
  database: "TP2",             // nombre de tu base de datos
  server: "localhost",         // o la IP de tu servidor
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexión a SQL Server exitosa ✅");
    return pool;
  } catch (err) {
    console.error("Error en la conexión a SQL:", err);
    throw err;
  }
}

module.exports = { sql, getConnection };

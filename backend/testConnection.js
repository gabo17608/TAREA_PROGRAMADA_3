const { getConnection } = require("./db");

async function test() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT TOP 1 * FROM Usuario");
    console.log("Resultado prueba:", result.recordset);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

test();

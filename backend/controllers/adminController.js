// backend/controllers/adminController.js
const adminService = require('../services/adminService');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const { username, password } = req.body;

    // 🔹 Agrega este log para debug
    console.log("Login attempt:", { username, password });

    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: 'username y password son obligatorios' });

    const result = await adminService.loginAdmin(username, password);
    // result: { outResultCode, outResultado }
    if (result.outResultCode === 0 && result.outResultado) {
      const payload = { username };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
      return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  } catch (err) {
    console.error('Error login:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}


module.exports = { login };

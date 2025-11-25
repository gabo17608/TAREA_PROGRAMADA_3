// backend/routes/pagos.js
const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { verifyToken } = require('../middlewares/auth');

router.post('/pagar', verifyToken, pagosController.pagarFacturaInterfaz);

module.exports = router;

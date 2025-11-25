// backend/routes/propiedades.js
const express = require('express');
const router = express.Router();
const propiedadesController = require('../controllers/propiedadesController');
const { verifyToken } = require('../middlewares/auth');

router.get('/buscar/:numeroFinca', verifyToken, propiedadesController.buscarPorPropiedad);
router.get('/info/:numeroFinca', verifyToken, propiedadesController.obtenerInfoPropiedad);

module.exports = router;

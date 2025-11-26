// backend/routes/propiedades.js
const express = require('express');
const router = express.Router();
const propiedadesController = require('../controllers/propiedadesController');

router.get('/buscar/:numeroFinca', propiedadesController.buscarPorPropiedad);
router.get('/info/:numeroFinca', propiedadesController.obtenerInfoPropiedad);

module.exports = router;

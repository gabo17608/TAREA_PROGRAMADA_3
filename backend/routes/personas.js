// backend/routes/personas.js
const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personasController');

// Endpoint para buscar persona y listar propiedades
router.get('/buscar/:documento', personasController.buscarPorPersona);

module.exports = router;

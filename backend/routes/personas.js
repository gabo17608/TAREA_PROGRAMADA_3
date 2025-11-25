// backend/routes/personas.js
const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personasController');
const { verifyToken } = require('../middlewares/auth');

router.get('/buscar/:documento', verifyToken, personasController.buscarPorPersona);

module.exports = router;

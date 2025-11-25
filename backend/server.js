// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const propiedadesRoutes = require('./routes/propiedades');
const personasRoutes = require('./routes/personas');
const pagosRoutes = require('./routes/pagos');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas API
app.use('/api/admin', adminRoutes);
app.use('/api/propiedades', propiedadesRoutes);
app.use('/api/personas', personasRoutes);
app.use('/api/pagos', pagosRoutes);

// sirve frontend estático (opcional)
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

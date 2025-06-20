const express = require('express');
const cors = require('cors');
const hechoRoutes = require('./routes/hechos');
const authRoutes = require('./routes/auth');
const seccionesRoutes = require('./routes/secciones'); // 👈 Importar las rutas de secciones

const app = express();

// Configuración CORS correcta
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api/hechos', hechoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/secciones', seccionesRoutes); // 👈 Agregar la ruta

app.get('/', (req, res) => {
  res.send('API del Museo funcionando correctamente :)');
});

module.exports = app;
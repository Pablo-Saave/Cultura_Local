/**
 * proyectos.routes.js - Rutas de proyectos
 * Define rutas de proyectos (CRUD completo para gestionar proyectos culturales).
 */

const express = require('express');
const router = express.Router();

// Rutas temporales - implementar después
router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Ruta de proyectos - pendiente implementación' });
});

module.exports = router;

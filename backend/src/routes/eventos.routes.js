/**
 * eventos.routes.js - Rutas de eventos
 * Define rutas de eventos (GET /eventos, POST /eventos, PUT /eventos/:id, DELETE /eventos/:id).
 */

const express = require('express');
const router = express.Router();

// Rutas temporales - implementar después
router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Ruta de eventos - pendiente implementación' });
});

module.exports = router;

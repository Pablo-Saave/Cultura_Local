/**
 * contacto.routes.js - Rutas de contacto
 * Define ruta de contacto (POST /contacto) para recibir mensajes del formulario.
 */

const express = require('express');
const router = express.Router();

// Ruta temporal - implementar después
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Ruta de contacto - pendiente implementación' });
});

module.exports = router;

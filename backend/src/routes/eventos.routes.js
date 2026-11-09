/**
 * eventos.routes.js - Rutas de eventos
 * Define rutas de eventos (GET /eventos, POST /eventos, PUT /eventos/:id, DELETE /eventos/:id).
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { uploadEventos } = require('../config/cloudinary');
const {
  getEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento
} = require('../controllers/eventos.controller');

// Rutas públicas
router.get('/', getEventos);
router.get('/:id', getEventoById);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken, uploadEventos.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]), createEvento);
router.put('/:id', verifyToken, uploadEventos.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]), updateEvento);
router.delete('/:id', verifyToken, deleteEvento);

module.exports = router;
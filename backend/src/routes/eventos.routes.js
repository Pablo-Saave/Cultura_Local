/**
 * eventos.routes.js - Rutas de eventos
 * Define rutas de eventos (GET /eventos, POST /eventos, PUT /eventos/:id, DELETE /eventos/:id).
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
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
router.post('/', protect, uploadEventos.single('imagen'), createEvento);
router.put('/:id', protect, uploadEventos.single('imagen'), updateEvento);
router.delete('/:id', protect, deleteEvento);

module.exports = router;


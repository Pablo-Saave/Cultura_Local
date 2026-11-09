/**
 * eventos.routes.js - Rutas de eventos
 * Define rutas de eventos (GET /eventos, POST /eventos, PUT /eventos/:id, DELETE /eventos/:id).
 */

const express = require('express');
const router = express.Router();
const { verifyToken, optionalAuth, requireRole } = require('../middleware/auth.middleware');
const { validateObjectId } = require('../utils/validators');
const { uploadEventos } = require('../config/cloudinary');
const {
  getEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento
} = require('../controllers/eventos.controller');

const camposImagen = uploadEventos.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]);

// Rutas públicas (optionalAuth: el panel admin ve también los no publicados)
router.get('/', optionalAuth, getEventos);
router.get('/:id', validateObjectId(), optionalAuth, getEventoById);

// Rutas protegidas. Autenticación ANTES de multer (no subir archivos sin sesión).
router.post('/', verifyToken, requireRole('admin', 'editor'), camposImagen, createEvento);
router.put('/:id', validateObjectId(), verifyToken, requireRole('admin', 'editor'), camposImagen, updateEvento);
router.delete('/:id', validateObjectId(), verifyToken, requireRole('admin'), deleteEvento);

module.exports = router;
/**
 * eventos.routes.js - Rutas de eventos
 * Define rutas de eventos (GET /eventos, POST /eventos, PUT /eventos/:id, DELETE /eventos/:id).
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
  getEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento
} = require('../controllers/eventos.controller');

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/eventos');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'evento-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// Rutas públicas
router.get('/', getEventos);
router.get('/:id', getEventoById);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, upload.single('imagen'), createEvento);
router.put('/:id', protect, upload.single('imagen'), updateEvento);
router.delete('/:id', protect, deleteEvento);

module.exports = router;


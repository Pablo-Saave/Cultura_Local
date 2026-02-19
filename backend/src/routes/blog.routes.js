/**
 * blog.routes.js - Rutas de Blog
 * Define las rutas para el CRUD de posts del blog
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/blog.controller');
const { protect } = require('../middleware/authMiddleware');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/img/blog'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Rutas públicas
router.get('/', getPosts);
router.get('/:id', getPostById);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, upload.single('imagen'), createPost);
router.put('/:id', protect, upload.single('imagen'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;

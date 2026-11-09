/**
 * blog.routes.js - Rutas de Blog
 * Define las rutas para el CRUD de posts del blog
 */

const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/blog.controller');
const { verifyToken, optionalAuth, requireRole } = require('../middleware/auth.middleware');
const { validateObjectId } = require('../utils/validators');
const { uploadBlog } = require('../config/cloudinary');

const camposImagen = uploadBlog.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]);

// Rutas públicas (optionalAuth: el panel admin ve también los borradores)
router.get('/', optionalAuth, getPosts);
router.get('/:id', validateObjectId(), optionalAuth, getPostById);

// Rutas protegidas. La autenticación va ANTES de multer para que
// nadie sin sesión pueda subir archivos a Cloudinary.
router.post('/', verifyToken, requireRole('admin', 'editor'), camposImagen, createPost);
router.put('/:id', validateObjectId(), verifyToken, requireRole('admin', 'editor'), camposImagen, updatePost);
router.delete('/:id', validateObjectId(), verifyToken, requireRole('admin'), deletePost);

module.exports = router;
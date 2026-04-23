/**
 * blog.routes.js - Rutas de Blog
 * Define las rutas para el CRUD de posts del blog
 */

const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/blog.controller');
const { protect } = require('../middleware/authMiddleware');
const { uploadBlog } = require('../config/cloudinary');

// Rutas públicas
router.get('/', getPosts);
router.get('/:id', getPostById);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, uploadBlog.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]), createPost);
router.put('/:id', protect, uploadBlog.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;

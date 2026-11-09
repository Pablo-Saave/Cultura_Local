/**
 * blog.routes.js - Rutas de Blog
 * Define las rutas para el CRUD de posts del blog
 */

const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/blog.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { uploadBlog } = require('../config/cloudinary');

// Rutas públicas
router.get('/', getPosts);
router.get('/:id', getPostById);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken, uploadBlog.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]), createPost);
router.put('/:id', verifyToken, uploadBlog.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenDetalle', maxCount: 1 }
]), updatePost);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
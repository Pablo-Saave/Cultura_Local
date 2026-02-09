/**
 * auth.routes.js - Rutas de Autenticación
 * Define endpoints para login, perfil, etc.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// POST /api/auth/login - Login de usuario
router.post('/login', authController.login);

// GET /api/auth/profile - Obtener perfil (requiere auth)
router.get('/profile', verifyToken, authController.getProfile);

// GET /api/auth/verify - Verificar token
router.get('/verify', verifyToken, authController.verifyToken);

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;

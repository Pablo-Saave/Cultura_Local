/**
 * auth.routes.js - Rutas de Autenticación
 * Define endpoints para login, perfil, etc.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Máx. 10 intentos fallidos por IP cada 15 minutos (los logins exitosos no cuentan)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos de inicio de sesión. Intenta en 15 minutos.' }
});

// POST /api/auth/login - Login de usuario
router.post('/login', loginLimiter, authController.login);

// GET /api/auth/profile - Obtener perfil (requiere auth)
router.get('/profile', verifyToken, authController.getProfile);

// GET /api/auth/verify - Verificar token
router.get('/verify', verifyToken, authController.verifyToken);

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
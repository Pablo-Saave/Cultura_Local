/**
 * auth.middleware.js - Middleware de Autenticación
 * Verifica tokens JWT y protege rutas
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cultura_local_secret_2026');
    
    // Buscar usuario
    const user = await User.findById(decoded.id);
    
    if (!user || !user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autorizado'
      });
    }

    // Agregar usuario a request
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error en autenticación',
      error: error.message
    });
  }
};

// Middleware para verificar rol de administrador
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requieren permisos de administrador'
    });
  }
  next();
};

// Middleware para verificar rol de editor o superior
exports.isEditor = (req, res, next) => {
  if (!['admin', 'editor'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requieren permisos de editor'
    });
  }
  next();
};

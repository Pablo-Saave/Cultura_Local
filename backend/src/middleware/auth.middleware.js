/**
 * auth.middleware.js - Middleware de autenticación y autorización
 * Único middleware de auth del proyecto (reemplaza a authMiddleware.js).
 *  - verifyToken: exige JWT válido y usuario existente y activo
 *  - optionalAuth: identifica al usuario si hay token válido; si no, sigue como anónimo
 *  - requireRole: restringe por rol
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../config/auth.config');

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
};

// Devuelve el usuario si el token es válido y la cuenta sigue activa; null en caso contrario
const resolveUser = async (token) => {
  const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
  const user = await User.findById(decoded.id);
  if (!user || !user.activo) return null;
  return user;
};

const unauthorized = (res, message) =>
  res.status(401).json({ success: false, message });

exports.verifyToken = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return unauthorized(res, 'No se proporcionó token de autenticación');

  try {
    const user = await resolveUser(token);
    if (!user) return unauthorized(res, 'Usuario no autorizado');

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return unauthorized(res, 'Token expirado');
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return unauthorized(res, 'Token inválido');
    }
    return next(error);
  }
};

// Para rutas públicas que muestran más datos a usuarios autenticados (ej. borradores)
exports.optionalAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const user = await resolveUser(token);
    if (user) req.user = user;
  } catch (error) {
    // Token inválido o expirado: se trata como visitante anónimo
  }
  return next();
};

// Uso: router.delete('/:id', verifyToken, requireRole('admin'), handler)
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: no tienes permisos para esta acción'
    });
  }
  return next();
};
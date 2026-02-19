/**
 * authMiddleware.js - Middleware de autenticación
 * Verifica el token JWT y protege rutas
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cultura_local_secret_key_2024');

      // Obtener usuario del token (sin la contraseña)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Error en autenticación:', error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

module.exports = { protect };

/**
 * auth.controller.js - Controlador de Autenticación
 * Maneja login, perfil y cambio de contraseña
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getJwtSecret, JWT_EXPIRES_IN } = require('../config/auth.config');

const MIN_PASSWORD_LENGTH = 8;

// Hash falso para igualar el tiempo de respuesta cuando el usuario no existe
// (evita enumerar usuarios midiendo tiempos)
const DUMMY_HASH = bcrypt.hashSync('contraseña-inexistente', 10);

const generateToken = (userId) =>
  jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' });

const invalidCredentials = (res) =>
  res.status(401).json({ success: false, message: 'Credenciales inválidas' });

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Solo strings: evita inyección de operadores ({ "$ne": null })
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son obligatorios'
      });
    }

    const user = await User.findOne({ username: username.trim() }).select('+password');

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      return invalidCredentials(res);
    }

    const isMatch = await user.comparePassword(password);

    // Mismo mensaje para cuenta inexistente, desactivada o password incorrecta
    if (!isMatch || !user.activo) return invalidCredentials(res);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token: generateToken(user._id),
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario autenticado
exports.getProfile = (req, res) => {
  res.json({ success: true, data: req.user.toPublicJSON() });
};

// Verificar token (para mantener sesión activa)
exports.verifyToken = (req, res) => {
  res.json({ success: true, message: 'Token válido', data: req.user.toPublicJSON() });
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (typeof oldPassword !== 'string' || typeof newPassword !== 'string' || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva son obligatorias'
      });
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe ser distinta a la actual'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error al cambiar contraseña' });
  }
};
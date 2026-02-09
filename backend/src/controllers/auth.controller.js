/**
 * auth.controller.js - Controlador de Autenticación
 * Maneja login, registro y gestión de tokens
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'cultura_local_secret_2026',
    { expiresIn: '7d' } // Token válido por 7 días
  );
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar datos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son obligatorios'
      });
    }

    // Buscar usuario (incluir password que está en select: false)
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Comparar password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user._id);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: user.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// Verificar token (para mantener sesión activa)
exports.verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token válido',
      data: req.user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar token',
      error: error.message
    });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva son obligatorias'
      });
    }

    // Obtener usuario con password
    const user = await User.findById(req.user._id).select('+password');
    
    // Verificar contraseña actual
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

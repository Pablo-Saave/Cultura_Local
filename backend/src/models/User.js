/**
 * User.js - Modelo de Usuario
 * Esquema de Mongoose para usuarios administradores con autenticación
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No devolver password por defecto en queries
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor'
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // createdAt, updatedAt automáticos
});

// Middleware: Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Método para obtener objeto público (sin password)
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    nombre: this.nombre,
    role: this.role,
    activo: this.activo,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);

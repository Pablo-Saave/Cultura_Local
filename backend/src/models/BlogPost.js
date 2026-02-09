/**
 * BlogPost.js - Modelo de Entrada de Blog
 * Esquema de Mongoose para noticias y entradas del blog
 */

const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  contenido: {
    type: String,
    required: [true, 'El contenido es obligatorio']
  },
  extracto: {
    type: String,
    maxlength: [500, 'El extracto no puede exceder 500 caracteres']
  },
  imagenPortada: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    enum: ['Noticia', 'Reflexión', 'Entrevista', 'Comunidad', 'Cultura', 'Otro'],
    default: 'Noticia'
  },
  etiquetas: [{
    type: String,
    trim: true
  }],
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicado: {
    type: Boolean,
    default: false
  },
  fechaPublicacion: {
    type: Date,
    default: null
  },
  vistas: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Crear slug automáticamente antes de guardar
blogPostSchema.pre('save', function(next) {
  if (this.isModified('titulo') && !this.slug) {
    this.slug = this.titulo
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^\w\s-]/g, '') // Quitar caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .trim();
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);

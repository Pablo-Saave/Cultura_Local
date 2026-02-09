/**
 * Proyecto.js - Modelo de Proyecto
 * Esquema de Mongoose para proyectos. Define estructura 
 * (nombre, descripción, imágenes, categoría).
 */

const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [3000, 'La descripción no puede exceder 3000 caracteres']
  },
  imagenPrincipal: {
    type: String,
    default: ''
  },
  imagenes: [{
    type: String
  }],
  categoria: {
    type: String,
    enum: ['Cartografía', 'Fotografía', 'Arte Visual', 'Relatos', 'Patrimonio', 'Comunidad', 'Otro'],
    default: 'Otro'
  },
  etiquetas: [{
    type: String,
    trim: true
  }],
  autor: {
    type: String,
    trim: true
  },
  colaboradores: [{
    type: String,
    trim: true
  }],
  fechaRealizacion: {
    type: Date
  },
  ubicacion: {
    type: String,
    trim: true
  },
  publicado: {
    type: Boolean,
    default: false
  },
  destacado: {
    type: Boolean,
    default: false
  },
  linkExterno: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Proyecto', proyectoSchema);

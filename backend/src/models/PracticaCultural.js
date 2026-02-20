/**
 * PracticaCultural.js - Modelo de Práctica Cultural
 * Esquema de Mongoose para prácticas culturales y metodologías
 */

const mongoose = require('mongoose');

const practicaCulturalSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  objetivos: [{
    type: String,
    trim: true
  }],
  metodologia: {
    type: String
  },
  recursos: [{
    titulo: String,
    descripcion: String,
    link: String
  }],
  imagen: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    enum: ['Metodología', 'Técnica', 'Herramienta', 'Proceso', 'Otro'],
    default: 'Otro'
  },
  ambito: {
    type: String,
    enum: ['Educación', 'Comunidad', 'Arte', 'Patrimonio', 'Investigación', 'Otro'],
    default: 'Otro'
  },
  duracionEstimada: {
    type: String,
    trim: true
  },
  participantesRecomendados: {
    type: String,
    trim: true
  },
  materialesNecesarios: [{
    type: String,
    trim: true
  }],
  pasos: [{
    numero: Number,
    titulo: String,
    descripcion: String
  }],
  ejemplosAplicacion: [{
    type: String
  }],
  publicado: {
    type: Boolean,
    default: false
  },
  destacado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PracticaCultural', practicaCulturalSchema);

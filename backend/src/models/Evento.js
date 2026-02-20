/**
 * Evento.js - Modelo de Evento
 * Esquema de Mongoose para eventos. Define campos (título, fecha, ubicación, descripción) 
 * con validaciones y tipos de datos.
 */

const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  horaInicio: {
    type: String,
    required: [true, 'La hora de inicio es obligatoria']
  },
  horaFin: {
    type: String
  },
  ubicacion: {
    type: String,
    required: [true, 'La ubicación es obligatoria'],
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    enum: ['Taller', 'Charla', 'Exposición', 'Encuentro', 'Festival'],
    default: 'Taller'
  },
  organizador: {
    type: String,
    trim: true
  },
  cuposMaximos: {
    type: Number,
    min: 0
  },
  inscripcionAbierta: {
    type: Boolean,
    default: true
  },
  linkInscripcion: {
    type: String
  },
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

module.exports = mongoose.model('Evento', eventoSchema);

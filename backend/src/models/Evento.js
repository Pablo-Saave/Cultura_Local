/**
 * Evento.js - Modelo de Evento
 * Esquema de Mongoose para eventos. Define campos (título, fecha, ubicación, descripción) 
 * con validaciones y tipos de datos.
 */

const mongoose = require('mongoose');
const { generarSlugUnico } = require('../utils/slug');

const eventoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  // URL amigable (se genera sola a partir del título)
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    index: true
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
    type: String
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
  imagenDetalle: {
    type: String,
    default: ''
  },
  categoria: {
    type: String,
    enum: ['Taller', 'Conversatorio', 'Exposición', 'Encuentro', 'Festival'],
    default: 'Conversatorio'
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

// Genera el slug la primera vez (no cambia al editar, para no romper links ya compartidos)
eventoSchema.pre('validate', async function (next) {
  try {
    if (!this.slug && this.titulo) {
      this.slug = await generarSlugUnico(this.constructor, this.titulo, this._id);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Evento', eventoSchema);
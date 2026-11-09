/**
 * Blog.js - Modelo de Blog Post
 * Define la estructura de los posts del blog en MongoDB
 */

const mongoose = require('mongoose');
const { generarSlugUnico } = require('../utils/slug');

const blogSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede tener más de 200 caracteres']
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
    required: [true, 'La descripción es requerida']
  },
  categoria: {
    type: String,
    enum: ['ENTREVISTA', 'NOTICIA', 'ARTICULO'],
    required: [true, 'La categoría es requerida']
  },
  fecha: {
    type: Date
  },
  imagen: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  imagenDetalle: {
    type: String,
    default: ''
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  estado: {
    type: String,
    enum: ['publicado', 'borrador'],
    default: 'publicado'
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Genera el slug la primera vez (no cambia al editar, para no romper links ya compartidos)
blogSchema.pre('validate', async function (next) {
  try {
    if (!this.slug && this.titulo) {
      this.slug = await generarSlugUnico(this.constructor, this.titulo, this._id);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
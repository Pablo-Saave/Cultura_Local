/**
 * Blog.js - Modelo de Blog Post
 * Define la estructura de los posts del blog en MongoDB
 */

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede tener más de 200 caracteres']
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

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

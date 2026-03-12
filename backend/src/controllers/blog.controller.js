/**
 * blog.controller.js - Controlador de Blog
 * Maneja la lógica de negocio para posts del blog
 */

const Blog = require('../models/Blog');

// Obtener todos los posts
const getPosts = async (req, res) => {
  try {
    const posts = await Blog.find()
      .populate('autor', 'nombre email')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ message: 'Error al obtener posts', error: error.message });
  }
};

// Obtener un post por ID
const getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id)
      .populate('autor', 'nombre email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error al obtener post:', error);
    res.status(500).json({ message: 'Error al obtener post', error: error.message });
  }
};

// Crear un nuevo post
const createPost = async (req, res) => {
  try {
    const { titulo, descripcion, categoria } = req.body;
    
    // Verificar que se subió una imagen
    if (!req.file) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }
    
    const newPost = new Blog({
      titulo,
      descripcion,
      categoria,
      imagen: req.file.path, // Cloudinary devuelve la URL en file.path
      autor: req.user.id
    });
    
    await newPost.save();
    
    // Poblar el autor antes de devolver
    await newPost.populate('autor', 'nombre email');
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ message: 'Error al crear post', error: error.message });
  }
};

// Actualizar un post
const updatePost = async (req, res) => {
  try {
    const { titulo, descripcion, categoria } = req.body;
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    // Actualizar campos
    post.titulo = titulo || post.titulo;
    post.descripcion = descripcion || post.descripcion;
    post.categoria = categoria || post.categoria;
    
    // Si se subió una nueva imagen
    if (req.file) {
      post.imagen = req.file.path; // Cloudinary devuelve la URL en file.path
    }
    
    await post.save();
    await post.populate('autor', 'nombre email');
    
    res.json(post);
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ message: 'Error al actualizar post', error: error.message });
  }
};

// Eliminar un post
const deletePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    // Con Cloudinary, las imágenes permanecen en la nube
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ message: 'Error al eliminar post', error: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};

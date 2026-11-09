/**
 * blog.controller.js - Controlador de Blog
 * Maneja la lógica de negocio para posts del blog
 */

const Blog = require('../models/Blog');
const { handleError } = require('../utils/http');
const { parseDate, pick } = require('../utils/validators');
const { destroyImages } = require('../utils/cloudinaryHelpers');

// Campos que el cliente puede enviar (whitelist)
const CAMPOS_PERMITIDOS = ['titulo', 'descripcion', 'categoria'];

// Visitantes: solo posts publicados. Usuarios autenticados (panel admin): todos.
const filtroVisibilidad = (req) => (req.user ? {} : { estado: { $ne: 'borrador' } });

// Obtener todos los posts
const getPosts = async (req, res) => {
  try {
    const posts = await Blog.find(filtroVisibilidad(req))
      .populate('autor', 'nombre') // el email del autor NO se expone públicamente
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    handleError(res, error, 'Error al obtener posts');
  }
};

// Obtener un post por ID
const getPostById = async (req, res) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id, ...filtroVisibilidad(req) })
      .populate('autor', 'nombre');

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    handleError(res, error, 'Error al obtener post');
  }
};

// Crear un nuevo post
const createPost = async (req, res) => {
  const imagenSubida = req.files?.imagen?.[0]?.path;
  const detalleSubido = req.files?.imagenDetalle?.[0]?.path;

  try {
    if (!imagenSubida) {
      await destroyImages([detalleSubido]);
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    const fecha = parseDate(req.body.fecha);
    if (fecha === null) {
      await destroyImages([imagenSubida, detalleSubido]);
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    const newPost = new Blog({
      ...pick(req.body, CAMPOS_PERMITIDOS),
      fecha,
      imagen: imagenSubida,
      imagenDetalle: detalleSubido || '',
      autor: req.user.id
    });

    await newPost.save();
    await newPost.populate('autor', 'nombre');

    res.status(201).json(newPost);
  } catch (error) {
    // Si falla el guardado, no dejar imágenes huérfanas en Cloudinary
    await destroyImages([imagenSubida, detalleSubido]);
    handleError(res, error, 'Error al crear post');
  }
};

// Actualizar un post
const updatePost = async (req, res) => {
  const imagenNueva = req.files?.imagen?.[0]?.path;
  const detalleNueva = req.files?.imagenDetalle?.[0]?.path;

  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      await destroyImages([imagenNueva, detalleNueva]);
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const fecha = parseDate(req.body.fecha);
    if (fecha === null) {
      await destroyImages([imagenNueva, detalleNueva]);
      return res.status(400).json({ message: 'Fecha inválida' });
    }

    const campos = pick(req.body, CAMPOS_PERMITIDOS);
    CAMPOS_PERMITIDOS.forEach((campo) => {
      if (campos[campo]) post[campo] = campos[campo];
    });
    if (fecha) post.fecha = fecha;

    const imagenesAntiguas = [];
    if (imagenNueva) {
      imagenesAntiguas.push(post.imagen);
      post.imagen = imagenNueva;
    }
    if (detalleNueva) {
      imagenesAntiguas.push(post.imagenDetalle);
      post.imagenDetalle = detalleNueva;
    }

    await post.save();
    await post.populate('autor', 'nombre');

    await destroyImages(imagenesAntiguas); // solo si el guardado fue exitoso

    res.json(post);
  } catch (error) {
    await destroyImages([imagenNueva, detalleNueva]);
    handleError(res, error, 'Error al actualizar post');
  }
};

// Eliminar un post
const deletePost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await destroyImages([post.imagen, post.imagenDetalle]);

    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar post');
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
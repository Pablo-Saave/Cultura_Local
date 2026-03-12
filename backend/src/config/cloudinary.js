/**
 * cloudinary.js - Configuración de Cloudinary
 * Configuración para almacenamiento de imágenes en la nube
 */

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configurar Cloudinary con credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de almacenamiento para proyectos
const proyectosStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cultura-local/proyectos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Configuración de almacenamiento para eventos
const eventosStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cultura-local/eventos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Configuración de almacenamiento para blog
const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cultura-local/blog',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Configurar multer para cada tipo
const uploadProyectos = multer({
  storage: proyectosStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadEventos = multer({
  storage: eventosStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadBlog = multer({
  storage: blogStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
  cloudinary,
  uploadProyectos,
  uploadEventos,
  uploadBlog
};

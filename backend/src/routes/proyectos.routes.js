/**
 * proyectos.routes.js - Rutas de proyectos
 * Define rutas de proyectos (CRUD completo para gestionar proyectos culturales).
 */

const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/proyectos/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proyecto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
});

// Rutas públicas
router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', proyectosController.obtenerProyectoPorId);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken, upload.array('imagenes', 5), proyectosController.crearProyecto);
router.put('/:id', verifyToken, upload.array('imagenes', 5), proyectosController.actualizarProyecto);
router.delete('/:id', verifyToken, proyectosController.eliminarProyecto);

module.exports = router;

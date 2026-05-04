/**
 * proyectos.routes.js - Rutas de proyectos
 * Define rutas de proyectos (CRUD completo para gestionar proyectos culturales).
 */

const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { uploadProyectosGaleria } = require('../config/cloudinary');

// Rutas públicas
router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', proyectosController.obtenerProyectoPorId);

// Rutas protegidas (requieren autenticación)
// Usando uploadProyectosGaleria para preservar proporciones en todas las imágenes
router.post('/', verifyToken, uploadProyectosGaleria.array('imagenes', 5), proyectosController.crearProyecto);
router.put('/:id', verifyToken, uploadProyectosGaleria.array('imagenes', 5), proyectosController.actualizarProyecto);
router.delete('/:id', verifyToken, proyectosController.eliminarProyecto);

module.exports = router;

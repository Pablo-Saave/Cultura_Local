/**
 * proyectos.routes.js - Rutas de proyectos
 * Define rutas de proyectos (CRUD completo para gestionar proyectos culturales).
 */

const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { uploadProyectos } = require('../config/cloudinary');

// Rutas públicas
router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', proyectosController.obtenerProyectoPorId);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken, uploadProyectos.array('imagenes', 5), proyectosController.crearProyecto);
router.put('/:id', verifyToken, uploadProyectos.array('imagenes', 5), proyectosController.actualizarProyecto);
router.delete('/:id', verifyToken, proyectosController.eliminarProyecto);

module.exports = router;

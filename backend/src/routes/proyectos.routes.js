/**
 * proyectos.routes.js - Rutas de proyectos
 * Define rutas de proyectos (CRUD completo para gestionar proyectos culturales).
 */

const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectos.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { validateObjectId } = require('../utils/validators');
const { uploadProyectosGaleria } = require('../config/cloudinary');

// Rutas públicas
router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', validateObjectId(), proyectosController.obtenerProyectoPorId);

// Rutas protegidas. Autenticación ANTES de multer (no subir archivos sin sesión).
// Usando uploadProyectosGaleria para preservar proporciones en todas las imágenes
router.post('/', verifyToken, requireRole('admin', 'editor'), uploadProyectosGaleria.array('imagenes', 5), proyectosController.crearProyecto);
router.put('/:id', validateObjectId(), verifyToken, requireRole('admin', 'editor'), uploadProyectosGaleria.array('imagenes', 5), proyectosController.actualizarProyecto);
router.delete('/:id', validateObjectId(), verifyToken, requireRole('admin'), proyectosController.eliminarProyecto);

module.exports = router;
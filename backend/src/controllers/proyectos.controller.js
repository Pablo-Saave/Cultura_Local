/**
 * proyectos.controller.js - Controlador de proyectos
 * Lógica de negocio para proyectos. Procesa solicitudes CRUD 
 * y aplica reglas de negocio.
 */

const Proyecto = require('../models/Proyecto');
const path = require('path');
const fs = require('fs').promises;

// Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ createdAt: -1 });
    res.json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ 
      message: 'Error al obtener proyectos', 
      error: error.message 
    });
  }
};

// Obtener un proyecto por ID
exports.obtenerProyectoPorId = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json(proyecto);
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    res.status(500).json({ 
      message: 'Error al obtener proyecto', 
      error: error.message 
    });
  }
};

// Crear nuevo proyecto
exports.crearProyecto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      etiquetas,
      autor,
      colaboradores,
      fechaRealizacion,
      ubicacion,
      publicado,
      destacado,
      linkExterno
    } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion) {
      return res.status(400).json({ 
        message: 'Nombre y descripción son obligatorios' 
      });
    }

    // Procesar imágenes si existen
    let imagenPrincipal = '';
    const imagenes = [];

    if (req.files && req.files.length > 0) {
      imagenPrincipal = `/img/proyectos/${req.files[0].filename}`;
      
      req.files.forEach(file => {
        imagenes.push(`/img/proyectos/${file.filename}`);
      });
    }

    // Crear el proyecto
    const nuevoProyecto = new Proyecto({
      nombre,
      descripcion,
      imagenPrincipal,
      imagenes,
      categoria,
      etiquetas: etiquetas ? JSON.parse(etiquetas) : [],
      autor,
      colaboradores: colaboradores ? JSON.parse(colaboradores) : [],
      fechaRealizacion: fechaRealizacion || null,
      ubicacion,
      publicado: publicado === 'true',
      destacado: destacado === 'true',
      linkExterno
    });

    await nuevoProyecto.save();
    
    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      proyecto: nuevoProyecto
    });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ 
      message: 'Error al crear proyecto', 
      error: error.message 
    });
  }
};

// Actualizar proyecto
exports.actualizarProyecto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      etiquetas,
      autor,
      colaboradores,
      fechaRealizacion,
      ubicacion,
      publicado,
      destacado,
      linkExterno
    } = req.body;

    const proyecto = await Proyecto.findById(req.params.id);
    
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Actualizar campos
    proyecto.nombre = nombre || proyecto.nombre;
    proyecto.descripcion = descripcion || proyecto.descripcion;
    proyecto.categoria = categoria || proyecto.categoria;
    proyecto.etiquetas = etiquetas ? JSON.parse(etiquetas) : proyecto.etiquetas;
    proyecto.autor = autor || proyecto.autor;
    proyecto.colaboradores = colaboradores ? JSON.parse(colaboradores) : proyecto.colaboradores;
    proyecto.fechaRealizacion = fechaRealizacion || proyecto.fechaRealizacion;
    proyecto.ubicacion = ubicacion || proyecto.ubicacion;
    proyecto.publicado = publicado !== undefined ? publicado === 'true' : proyecto.publicado;
    proyecto.destacado = destacado !== undefined ? destacado === 'true' : proyecto.destacado;
    proyecto.linkExterno = linkExterno || proyecto.linkExterno;

    // Procesar nuevas imágenes si existen
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = [];
      req.files.forEach(file => {
        nuevasImagenes.push(`/img/proyectos/${file.filename}`);
      });
      
      proyecto.imagenPrincipal = nuevasImagenes[0];
      proyecto.imagenes = nuevasImagenes;
    }

    await proyecto.save();
    
    res.json({
      message: 'Proyecto actualizado exitosamente',
      proyecto
    });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ 
      message: 'Error al actualizar proyecto', 
      error: error.message 
    });
  }
};

// Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    
    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Eliminar imágenes del servidor
    if (proyecto.imagenes && proyecto.imagenes.length > 0) {
      for (const imagen of proyecto.imagenes) {
        try {
          const imagePath = path.join(__dirname, '../../public', imagen);
          await fs.unlink(imagePath);
        } catch (error) {
          console.error('Error al eliminar imagen:', error);
        }
      }
    }

    await Proyecto.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Proyecto eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ 
      message: 'Error al eliminar proyecto', 
      error: error.message 
    });
  }
};
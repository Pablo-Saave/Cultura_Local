/**
 * eventos.controller.js - Controlador de eventos
 * Lógica de negocio para eventos. Maneja creación, consulta, actualización 
 * y eliminación de eventos en MongoDB.
 */
const Evento = require('../models/Evento');
const fs = require('fs');
const path = require('path');

// GET todos los eventos
exports.getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fecha: 1 });
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ message: 'Error al obtener eventos', error: error.message });
  }
};

// GET evento por ID
exports.getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    res.json(evento);
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ message: 'Error al obtener evento', error: error.message });
  }
};

// POST crear nuevo evento
exports.createEvento = async (req, res) => {
  try {
    const eventoData = {
      ...req.body,
      imagen: req.file ? `/img/eventos/${req.file.filename}` : ''
    };

    const evento = new Evento(eventoData);
    await evento.save();
    
    res.status(201).json(evento);
  } catch (error) {
    console.error('Error al crear evento:', error);
    
    // Si hay error, eliminar la imagen subida
    if (req.file) {
      const imagePath = path.join(__dirname, '../../public/img/eventos', req.file.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.status(500).json({ message: 'Error al crear evento', error: error.message });
  }
};

// PUT actualizar evento
exports.updateEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Si hay nueva imagen, eliminar la anterior
    if (req.file && evento.imagen) {
      const oldImagePath = path.join(__dirname, '../../public', evento.imagen);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      req.body.imagen = `/img/eventos/${req.file.filename}`;
    }

    // Actualizar campos
    Object.keys(req.body).forEach(key => {
      evento[key] = req.body[key];
    });

    await evento.save();
    res.json(evento);
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ message: 'Error al actualizar evento', error: error.message });
  }
};

// DELETE eliminar evento
exports.deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Eliminar imagen si existe
    if (evento.imagen) {
      const imagePath = path.join(__dirname, '../../public', evento.imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Evento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ message: 'Error al eliminar evento', error: error.message });
  }
};
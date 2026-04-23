/**
 * eventos.controller.js - Controlador de eventos
 * Lógica de negocio para eventos. Maneja creación, consulta, actualización 
 * y eliminación de eventos en MongoDB.
 */
const Evento = require('../models/Evento');

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
    const { fecha, ...otrosDatos } = req.body;
    
    // Procesar fecha: si es string YYYY-MM-DD, convertir a fecha al mediodía UTC
    let fechaProcesada = null
    if (fecha && typeof fecha === 'string' && fecha.length >= 10) {
      fechaProcesada = new Date(`${fecha}T12:00:00Z`)
    } else if (fecha) {
      fechaProcesada = new Date(fecha)
    }
    
    const eventoData = {
      ...otrosDatos,
      fecha: fechaProcesada,
      imagen: req.files?.imagen?.[0]?.path || '',
      imagenDetalle: req.files?.imagenDetalle?.[0]?.path || ''
    };

    const evento = new Evento(eventoData);
    await evento.save();
    
    res.status(201).json(evento);
  } catch (error) {
    console.error('Error al crear evento:', error);
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

    // Si hay nueva imagen, actualizar
    if (req.files?.imagen?.[0]) {
      req.body.imagen = req.files.imagen[0].path;
    }

    // Si hay nueva imagen detalle, actualizar
    if (req.files?.imagenDetalle?.[0]) {
      req.body.imagenDetalle = req.files.imagenDetalle[0].path;
    }

    // Procesar fecha si viene en el body
    if (req.body.fecha) {
      if (typeof req.body.fecha === 'string' && req.body.fecha.length >= 10) {
        req.body.fecha = new Date(`${req.body.fecha}T12:00:00Z`)
      } else {
        req.body.fecha = new Date(req.body.fecha)
      }
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

    // Con Cloudinary, las imágenes permanecen en la nube
    await Evento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ message: 'Error al eliminar evento', error: error.message });
  }
};
/**
 * eventos.controller.js - Controlador de eventos
 * Lógica de negocio para eventos. Maneja creación, consulta, actualización
 * y eliminación de eventos en MongoDB.
 */

const Evento = require('../models/Evento');
const { handleError } = require('../utils/http');
const { parseDate, safeUrl, pick } = require('../utils/validators');
const { destroyImages } = require('../utils/cloudinaryHelpers');

// Campos que el cliente puede enviar (whitelist). Evita mass assignment.
const CAMPOS_PERMITIDOS = [
  'titulo', 'descripcion', 'horaInicio', 'horaFin', 'ubicacion', 'direccion',
  'categoria', 'organizador', 'cuposMaximos', 'inscripcionAbierta',
  'publicado', 'destacado'
];

// Visitantes: solo eventos publicados. Usuarios autenticados (panel admin): todos.
const filtroVisibilidad = (req) => (req.user ? {} : { publicado: true });

// Valida y normaliza fecha + link. Devuelve { error } o { fecha, linkInscripcion }
const procesarCamposEspeciales = (body) => {
  const fecha = parseDate(body.fecha);
  if (fecha === null) return { error: 'Fecha inválida' };

  let linkInscripcion;
  if (body.linkInscripcion !== undefined) {
    linkInscripcion = safeUrl(body.linkInscripcion);
    if (linkInscripcion === null) return { error: 'El link de inscripción debe ser una URL http(s) válida' };
  }

  return { fecha, linkInscripcion };
};

// GET todos los eventos
exports.getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find(filtroVisibilidad(req)).sort({ fecha: 1 });
    res.json(eventos);
  } catch (error) {
    handleError(res, error, 'Error al obtener eventos');
  }
};

// GET evento por ID
exports.getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findOne({ _id: req.params.id, ...filtroVisibilidad(req) });

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (error) {
    handleError(res, error, 'Error al obtener evento');
  }
};

// POST crear nuevo evento
exports.createEvento = async (req, res) => {
  const imagen = req.files?.imagen?.[0]?.path || '';
  const imagenDetalle = req.files?.imagenDetalle?.[0]?.path || '';

  try {
    const { error, fecha, linkInscripcion } = procesarCamposEspeciales(req.body);
    if (error) {
      await destroyImages([imagen, imagenDetalle]);
      return res.status(400).json({ message: error });
    }

    const evento = new Evento({
      ...pick(req.body, CAMPOS_PERMITIDOS),
      fecha,
      linkInscripcion,
      imagen,
      imagenDetalle
    });

    await evento.save();
    res.status(201).json(evento);
  } catch (error) {
    await destroyImages([imagen, imagenDetalle]);
    handleError(res, error, 'Error al crear evento');
  }
};

// PUT actualizar evento
exports.updateEvento = async (req, res) => {
  const imagenNueva = req.files?.imagen?.[0]?.path;
  const detalleNueva = req.files?.imagenDetalle?.[0]?.path;

  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      await destroyImages([imagenNueva, detalleNueva]);
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const { error, fecha, linkInscripcion } = procesarCamposEspeciales(req.body);
    if (error) {
      await destroyImages([imagenNueva, detalleNueva]);
      return res.status(400).json({ message: error });
    }

    // Solo se asignan campos de la whitelist
    Object.entries(pick(req.body, CAMPOS_PERMITIDOS)).forEach(([campo, valor]) => {
      evento[campo] = valor;
    });
    if (fecha) evento.fecha = fecha;
    if (linkInscripcion !== undefined) evento.linkInscripcion = linkInscripcion;

    const imagenesAntiguas = [];
    if (imagenNueva) {
      imagenesAntiguas.push(evento.imagen);
      evento.imagen = imagenNueva;
    }
    if (detalleNueva) {
      imagenesAntiguas.push(evento.imagenDetalle);
      evento.imagenDetalle = detalleNueva;
    }

    await evento.save();
    await destroyImages(imagenesAntiguas); // solo si el guardado fue exitoso

    res.json(evento);
  } catch (error) {
    await destroyImages([imagenNueva, detalleNueva]);
    handleError(res, error, 'Error al actualizar evento');
  }
};

// DELETE eliminar evento
exports.deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    await destroyImages([evento.imagen, evento.imagenDetalle]);

    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar evento');
  }
};
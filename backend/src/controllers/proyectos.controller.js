/**
 * proyectos.controller.js - Controlador de proyectos
 * Lógica de negocio para proyectos. Procesa solicitudes CRUD
 * y aplica reglas de negocio.
 */

const Proyecto = require('../models/Proyecto');
const { handleError } = require('../utils/http');
const { parseDate, safeUrl, parseStringArray } = require('../utils/validators');
const { destroyImages } = require('../utils/cloudinaryHelpers');

// Valida los campos que requieren parseo. Devuelve { error } o los valores procesados.
const procesarCampos = (body) => {
  const etiquetas = parseStringArray(body.etiquetas);
  if (etiquetas === null) return { error: 'El campo etiquetas debe ser un arreglo JSON válido' };

  const colaboradores = parseStringArray(body.colaboradores);
  if (colaboradores === null) return { error: 'El campo colaboradores debe ser un arreglo JSON válido' };

  const fechaRealizacion = parseDate(body.fechaRealizacion);
  if (fechaRealizacion === null) return { error: 'Fecha de realización inválida' };

  let linkExterno;
  if (body.linkExterno !== undefined) {
    linkExterno = safeUrl(body.linkExterno);
    if (linkExterno === null) return { error: 'El link externo debe ser una URL http(s) válida' };
  }

  return { etiquetas, colaboradores, fechaRealizacion, linkExterno };
};

const esString = (v) => typeof v === 'string';

// Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({ createdAt: -1 });
    res.json(proyectos);
  } catch (error) {
    handleError(res, error, 'Error al obtener proyectos');
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
    handleError(res, error, 'Error al obtener proyecto');
  }
};

// Crear nuevo proyecto
exports.crearProyecto = async (req, res) => {
  const urlsSubidas = (req.files || []).map((file) => file.path);

  try {
    const { nombre, descripcion, categoria, autor, ubicacion, destacado, educativo } = req.body;

    if (!esString(nombre) || !esString(descripcion) || !nombre.trim() || !descripcion.trim()) {
      await destroyImages(urlsSubidas);
      return res.status(400).json({ message: 'Nombre y descripción son obligatorios' });
    }

    const procesados = procesarCampos(req.body);
    if (procesados.error) {
      await destroyImages(urlsSubidas);
      return res.status(400).json({ message: procesados.error });
    }

    const nuevoProyecto = new Proyecto({
      nombre,
      descripcion,
      imagenPrincipal: urlsSubidas[0] || '',
      imagenes: urlsSubidas,
      categoria: esString(categoria) && categoria.trim() !== '' ? categoria : 'Otro',
      etiquetas: procesados.etiquetas || [],
      autor,
      colaboradores: procesados.colaboradores || [],
      fechaRealizacion: procesados.fechaRealizacion || null,
      ubicacion,
      destacado: destacado === 'true',
      educativo: educativo === 'true',
      linkExterno: procesados.linkExterno
    });

    await nuevoProyecto.save();

    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      proyecto: nuevoProyecto
    });
  } catch (error) {
    await destroyImages(urlsSubidas);
    handleError(res, error, 'Error al crear proyecto');
  }
};

// Actualizar proyecto
exports.actualizarProyecto = async (req, res) => {
  const urlsSubidas = (req.files || []).map((file) => file.path);

  try {
    const { nombre, descripcion, categoria, autor, ubicacion, destacado, educativo } = req.body;

    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      await destroyImages(urlsSubidas);
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const procesados = procesarCampos(req.body);
    if (procesados.error) {
      await destroyImages(urlsSubidas);
      return res.status(400).json({ message: procesados.error });
    }

    proyecto.nombre = (esString(nombre) && nombre) || proyecto.nombre;
    proyecto.descripcion = (esString(descripcion) && descripcion) || proyecto.descripcion;
    proyecto.categoria = esString(categoria) && categoria.trim() !== '' ? categoria : (proyecto.categoria || 'Otro');
    proyecto.etiquetas = procesados.etiquetas ?? proyecto.etiquetas;
    proyecto.autor = (esString(autor) && autor) || proyecto.autor;
    proyecto.colaboradores = procesados.colaboradores ?? proyecto.colaboradores;
    proyecto.fechaRealizacion = procesados.fechaRealizacion || proyecto.fechaRealizacion;
    proyecto.ubicacion = (esString(ubicacion) && ubicacion) || proyecto.ubicacion;
    proyecto.destacado = destacado !== undefined ? destacado === 'true' : proyecto.destacado;
    proyecto.educativo = educativo !== undefined ? educativo === 'true' : proyecto.educativo;
    if (procesados.linkExterno) proyecto.linkExterno = procesados.linkExterno;

    // Nuevas imágenes: reemplazan a las anteriores
    let imagenesAntiguas = [];
    if (urlsSubidas.length > 0) {
      imagenesAntiguas = [...(proyecto.imagenes || [])];
      proyecto.imagenPrincipal = urlsSubidas[0];
      proyecto.imagenes = urlsSubidas;
    }

    await proyecto.save();
    await destroyImages(imagenesAntiguas); // solo si el guardado fue exitoso

    res.json({
      message: 'Proyecto actualizado exitosamente',
      proyecto
    });
  } catch (error) {
    await destroyImages(urlsSubidas);
    handleError(res, error, 'Error al actualizar proyecto');
  }
};

// Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByIdAndDelete(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Borra de Cloudinary (las rutas legacy "/img/..." se ignoran)
    await destroyImages(proyecto.imagenes || []);

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar proyecto');
  }
};
/**
 * http.js - Helpers para responder errores sin filtrar detalles internos
 */

// Convierte un error de Mongoose/Cloudinary en una respuesta segura
exports.handleError = (res, error, message) => {
  if (error.name === 'ValidationError') {
    const detalles = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: detalles.join('. ') });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Valor inválido en la solicitud' });
  }

  console.error(`${message}:`, error);
  return res.status(500).json({ success: false, message });
};
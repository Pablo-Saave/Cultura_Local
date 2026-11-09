/**
 * errorHandler.js - Middleware global de manejo de errores
 * Formatea errores conocidos y nunca expone detalles internos en producción.
 */

module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = err.statusCode || err.status || 500;
  let message = 'Error interno del servidor';

  if (err.name === 'MulterError') {
    status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'La imagen supera el tamaño máximo permitido (5 MB)'
      : 'Error al procesar el archivo subido';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors || {}).map((e) => e.message).join('. ') || 'Datos inválidos';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Valor inválido en la solicitud';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'JSON inválido';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'La solicitud es demasiado grande';
  } else if (status < 500 && err.message) {
    message = err.message;
  }

  if (status >= 500) console.error('Error:', err);

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
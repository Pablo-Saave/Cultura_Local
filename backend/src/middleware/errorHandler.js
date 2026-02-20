/**
 * errorHandler.js - Middleware de manejo de errores
 * Middleware global de manejo de errores. Captura excepciones, formatea respuestas 
 * de error y registra logs para debugging.
 */

module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * validators.js - Validaciones y parseos reutilizables
 */

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

// Middleware: valida que req.params[param] sea un ObjectId de Mongo
exports.validateObjectId = (param = 'id') => (req, res, next) => {
  if (!OBJECT_ID_REGEX.test(req.params[param] || '')) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }
  return next();
};

// Acepta solo URLs http/https (evita "javascript:" y similares en <a href>)
// Devuelve '' si está vacío, la URL normalizada si es válida o null si es inválida
exports.safeUrl = (value) => {
  if (value === undefined || value === null || String(value).trim() === '') return '';
  try {
    const url = new URL(String(value).trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch (error) {
    return null;
  }
};

// Parsea un arreglo JSON enviado por multipart. undefined si no viene, null si es inválido
exports.parseStringArray = (value) => {
  if (value === undefined) return undefined;
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch (error) {
    return null;
  }
};

// "YYYY-MM-DD" -> Date al mediodía UTC (evita desfases de zona horaria)
// undefined si no viene, null si es inválida
exports.parseDate = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const raw = String(value);
  const date = /^\d{4}-\d{2}-\d{2}/.test(raw)
    ? new Date(`${raw.slice(0, 10)}T12:00:00Z`)
    : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Copia solo las claves permitidas (whitelist) y descarta undefined
exports.pick = (source, keys) =>
  keys.reduce((acc, key) => {
    if (source && source[key] !== undefined) acc[key] = source[key];
    return acc;
  }, {});
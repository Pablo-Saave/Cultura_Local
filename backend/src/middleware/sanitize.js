/**
 * sanitize.js - Previene inyección de operadores NoSQL
 * Elimina claves que empiezan con "$" o contienen "." (y claves de prototype pollution)
 * de req.body y req.query. Ej: { "username": { "$ne": null } } -> { "username": {} }
 */

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const clean = (value) => {
  if (Array.isArray(value)) return value.map(clean);

  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.') || FORBIDDEN_KEYS.has(key)) continue;
      out[key] = clean(val);
    }
    return out;
  }

  return value;
};

module.exports = (req, res, next) => {
  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  next();
};
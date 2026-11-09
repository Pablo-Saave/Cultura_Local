/**
 * slug.js - Utilidades para URLs amigables (slugs)
 * Ejemplo: "Creadoras Chillán se adjudica Fondart" -> "creadoras-chillan-se-adjudica-fondart"
 */

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
const MAX_LENGTH = 80;

// Convierte un texto en slug: minúsculas, sin tildes, sin símbolos, con guiones
const slugify = (texto = '') => {
  let slug = String(texto)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-z0-9\s-]/g, '')                      // quitar símbolos («», :, ., etc.)
    .trim()
    .replace(/[\s_-]+/g, '-')                          // espacios a guiones
    .replace(/^-+|-+$/g, '');

  // Limitar largo sin cortar una palabra a la mitad
  if (slug.length > MAX_LENGTH) {
    slug = slug.slice(0, MAX_LENGTH);
    const ultimoGuion = slug.lastIndexOf('-');
    if (ultimoGuion > 20) slug = slug.slice(0, ultimoGuion);
  }

  return slug || 'sin-titulo';
};

// Genera un slug único para el modelo (agrega -2, -3... si ya existe)
const generarSlugUnico = async (Model, titulo, excludeId = null) => {
  let base = slugify(titulo);
  if (OBJECT_ID_REGEX.test(base)) base = `${base}-1`; // evita confundirlo con un ID de Mongo

  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
};

// Filtro para buscar por ID (links antiguos) o por slug (links nuevos)
const filtroIdOSlug = (valor) =>
  OBJECT_ID_REGEX.test(valor || '') ? { _id: valor } : { slug: String(valor || '').toLowerCase() };

module.exports = { slugify, generarSlugUnico, filtroIdOSlug };
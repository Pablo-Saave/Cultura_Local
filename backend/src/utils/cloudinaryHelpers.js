/**
 * cloudinaryHelpers.js - Limpieza de imágenes en Cloudinary
 * Evita imágenes huérfanas al eliminar o reemplazar contenido.
 */

const { cloudinary } = require('../config/cloudinary');

// https://res.cloudinary.com/<cloud>/image/upload/v123/carpeta/archivo.jpg -> carpeta/archivo
const extractPublicId = (url) => {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;
  const match = url.split('?')[0].match(/\/upload\/(?:v\d+\/)?(.+)\.[A-Za-z0-9]+$/);
  return match ? match[1] : null;
};

// Borra imágenes por URL. Nunca lanza: un fallo aquí no debe romper la operación principal
const destroyImages = async (urls = []) => {
  const ids = [...new Set(urls.map(extractPublicId).filter(Boolean))];
  if (ids.length === 0) return;

  const results = await Promise.allSettled(ids.map((id) => cloudinary.uploader.destroy(id)));
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`No se pudo borrar la imagen ${ids[i]} de Cloudinary:`, result.reason);
    }
  });
};

module.exports = { extractPublicId, destroyImages };
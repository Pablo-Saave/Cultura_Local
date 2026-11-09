/**
 * addSlugs.js - Asigna slug (URL amigable) a eventos y posts que aún no tienen
 * Ejecutar UNA vez con: npm run slugs
 * Es seguro repetirlo: solo toca los documentos sin slug. No borra nada.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Evento = require('../models/Evento');
const Blog = require('../models/Blog');
const { generarSlugUnico } = require('../utils/slug');

const procesar = async (Model, nombre) => {
  const docs = await Model.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] })
    .sort({ createdAt: 1 }); // los más antiguos se quedan con el slug "limpio"
  for (const doc of docs) {
    const slug = await generarSlugUnico(Model, doc.titulo, doc._id);
    // updateOne evita validar de nuevo el documento completo
    await Model.updateOne({ _id: doc._id }, { $set: { slug } });
    console.log(`[${nombre}] ${doc._id} -> ${slug}`);
  }
  console.log(`[${nombre}] ${docs.length} actualizado(s)`);
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    await Evento.syncIndexes();
    await Blog.syncIndexes();
    await procesar(Evento, 'eventos');
    await procesar(Blog, 'blog');
  } catch (error) {
    console.error('Error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
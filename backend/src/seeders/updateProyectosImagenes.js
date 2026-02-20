/**
 * updateProyectosImagenes.js - Actualizar imágenes de proyectos
 * Script para agregar las imágenes a los proyectos existentes
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Proyecto = require('../models/Proyecto');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cultura_local';

async function updateImagenes() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Actualizar Creadoras Chile
    const creadoras = await Proyecto.findOne({ nombre: 'Creadoras Chile' });
    if (creadoras) {
      creadoras.imagenPrincipal = '/img/logo.jpeg';
      creadoras.imagenes = ['/img/logo.jpeg'];
      await creadoras.save();
      console.log('✅ Actualizado: Creadoras Chile');
    }

    // Actualizar Concepción: Reversiones Fotográficas
    const concepcion = await Proyecto.findOne({ nombre: 'Concepción: Reversiones Fotográficas' });
    if (concepcion) {
      concepcion.imagenPrincipal = '/img/proyecto2.png';
      concepcion.imagenes = ['/img/proyecto2.png'];
      await concepcion.save();
      console.log('✅ Actualizado: Concepción: Reversiones Fotográficas');
    }

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('✅ Actualización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateImagenes();

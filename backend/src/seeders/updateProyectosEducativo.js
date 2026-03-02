/**
 * updateProyectosEducativo.js - Actualizar campo educativo
 * Script para agregar el campo educativo a proyectos existentes
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Proyecto = require('../models/Proyecto');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cultura_local';

async function updateEducativo() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    // Actualizar todos los proyectos que no tengan el campo educativo
    const result = await Proyecto.updateMany(
      { educativo: { $exists: false } },
      { $set: { educativo: false } }
    );

    console.log(` ${result.modifiedCount} proyectos actualizados`);

    // Cerrar conexión
    await mongoose.connection.close();
    console.log(' Actualización completada');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateEducativo();

/**
 * proyectoSeeder.js - Seeder de proyectos iniciales
 * Script para poblar la base de datos con proyectos iniciales
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Proyecto = require('../models/Proyecto');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cultura_local';

const proyectosIniciales = [
  {
    nombre: 'Creadoras Chile',
    descripcion: 'Plataforma que visibiliza y conecta a mujeres creadoras de Chile. Un espacio dedicado a promover el trabajo de artistas, diseñadoras, escritoras y creadoras de diversas disciplinas a lo largo del territorio nacional.',
    categoria: 'Comunidad',
    linkExterno: 'https://creadoraschile.cl/',
    publicado: true,
    destacado: true,
    autor: 'Fundación Cultura Local',
    ubicacion: 'Chile'
  },
  {
    nombre: 'Concepción: Reversiones Fotográficas',
    descripcion: 'Portafolio fotográfico que explora la ciudad de Concepción a través de reversiones visuales. Una mirada artística que transforma y reinterpreta los espacios urbanos mediante técnicas fotográficas innovadoras.',
    categoria: 'Fotografía',
    imagenPrincipal: 'proyecto2.jpeg',
    linkExterno: 'https://gustavoburgos.cl/concepcion-reversiones-fotograficas',
    publicado: true,
    destacado: false,
    autor: 'Gustavo Burgos',
    ubicacion: 'Concepción, Chile'
  }
];

async function seed() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección de proyectos (opcional)
    // await Proyecto.deleteMany({});
    // console.log('🗑️  Colección de proyectos limpiada');

    // Verificar si ya existen proyectos
    const proyectosExistentes = await Proyecto.find({});
    if (proyectosExistentes.length > 0) {
      console.log(`ℹ️  Ya existen ${proyectosExistentes.length} proyectos en la base de datos`);
      console.log('💡 Si deseas reemplazarlos, descomenta la línea de deleteMany() en el seeder');
      await mongoose.connection.close();
      return;
    }

    // Insertar proyectos
    const proyectosCreados = await Proyecto.insertMany(proyectosIniciales);
    console.log(`✅ ${proyectosCreados.length} proyectos creados exitosamente:`);
    proyectosCreados.forEach(p => {
      console.log(`   - ${p.nombre}`);
    });

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('✅ Seeder completado, conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    process.exit(1);
  }
}

// Ejecutar el seeder
seed();

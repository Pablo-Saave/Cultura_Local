/**
 * userSeeder.js - Script para crear usuarios por defecto
 * Ejecutar con: npm run seed
 */

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    username: 'admin',
    email: 'admin@culturalocal.cl',
    password: 'admin123', // CAMBIAR en producción
    nombre: 'Administrador',
    role: 'admin',
    activo: true
  },
  {
    username: 'editor',
    email: 'editor@culturalocal.cl',
    password: 'editor123', // CAMBIAR en producción
    nombre: 'Editor',
    role: 'editor',
    activo: true
  }
];

const seedUsers = async () => {
  try {
    // Conectar a MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cultura_local';
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    // Eliminar usuarios existentes para recrearlos
    await User.deleteMany({});
    console.log('Usuarios anteriores eliminados');

    // Crear usuarios
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Usuario creado: ${userData.username} (${userData.role})`);
    }

    console.log('\nSeeder completado exitosamente');
    console.log('\nCredenciales por defecto:');
    console.log('----------------------------');
    users.forEach(u => {
      console.log(`Usuario: ${u.username}`);
      console.log(`Password: ${u.password}`);
      console.log(`Rol: ${u.role}`);
      console.log('----------------------------');
    });
    console.log('\nIMPORTANTE: Cambiar estas contraseñas en producción\n');

    process.exit(0);

  } catch (error) {
    console.error('Error en seeder:', error);
    process.exit(1);
  }
};

seedUsers();

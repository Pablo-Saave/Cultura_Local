/**
 * userSeeder.js - Script para crear usuarios iniciales
 * Ejecutar con: npm run seed
 *
 * Seguridad:
 *  - NO borra usuarios existentes (solo crea los que faltan).
 *  - NO usa contraseñas conocidas: usa SEED_ADMIN_PASSWORD / SEED_EDITOR_PASSWORD
 *    o genera una aleatoria que se muestra UNA sola vez.
 *  - En producción exige ALLOW_SEED=true de forma explícita.
 */

require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');

const MIN_PASSWORD_LENGTH = 8;

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
  console.error('Seeder bloqueado en producción. Si realmente lo necesitas, ejecútalo con ALLOW_SEED=true.');
  process.exit(1);
}

const resolvePassword = (envValue) => {
  if (envValue) {
    if (envValue.length < MIN_PASSWORD_LENGTH) {
      console.error(`Las contraseñas del seeder deben tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      process.exit(1);
    }
    return { password: envValue, generated: false };
  }
  return { password: crypto.randomBytes(12).toString('base64url'), generated: true };
};

const definitions = [
  {
    username: 'admin',
    email: 'admin@culturalocal.cl',
    nombre: 'Administrador',
    role: 'admin',
    passwordEnv: process.env.SEED_ADMIN_PASSWORD
  },
  {
    username: 'editor',
    email: 'editor@culturalocal.cl',
    nombre: 'Editor',
    role: 'editor',
    passwordEnv: process.env.SEED_EDITOR_PASSWORD
  }
];

const seedUsers = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI
      || (process.env.NODE_ENV !== 'production' ? 'mongodb://localhost:27017/cultura_local' : null);

    if (!MONGO_URI) {
      console.error('MONGO_URI no está definido.');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    const generatedCredentials = [];

    for (const { passwordEnv, ...data } of definitions) {
      const exists = await User.exists({ $or: [{ username: data.username }, { email: data.email }] });
      if (exists) {
        console.log(`Ya existe: ${data.username} (se omite, no se modifica)`);
        continue;
      }

      const { password, generated } = resolvePassword(passwordEnv);
      await new User({ ...data, password, activo: true }).save();
      console.log(`Usuario creado: ${data.username} (${data.role})`);

      if (generated) generatedCredentials.push({ username: data.username, password });
    }

    if (generatedCredentials.length > 0) {
      console.log('\nContraseñas generadas (se muestran SOLO ahora, guárdalas en un gestor de contraseñas):');
      generatedCredentials.forEach((c) => console.log(`  ${c.username}: ${c.password}`));
    }

    console.log('\nSeeder completado');
    process.exit(0);
  } catch (error) {
    console.error('Error en seeder:', error.message);
    process.exit(1);
  }
};

seedUsers();
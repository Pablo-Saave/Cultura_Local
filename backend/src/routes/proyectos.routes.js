/**
 * proyectos.routes.js - Rutas de proyectos
 * Define rutas de proyectos (CRUD completo para gestionar proyectos culturales).
 */

const express = require('express');
const router = express.Router();

// Simulando proyectos estáticos (los que están en el frontend)
const proyectosEstaticos = [
  {
    id: 1,
    nombre: 'Creadoras Chile',
    descripcion: 'Plataforma que visibiliza y conecta a mujeres creadoras de Chile'
  },
  {
    id: 2,
    nombre: 'Concepción: Reversiones Fotográficas',
    descripcion: 'Portafolio fotográfico que explora la ciudad de Concepción'
  }
];

router.get('/', (req, res) => {
  res.json(proyectosEstaticos);
});

module.exports = router;

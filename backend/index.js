/**
 * index.js - Punto de entrada del servidor
 * Punto de entrada del servidor. Inicia Express, conecta a MongoDB, 
 * registra rutas, middlewares y escucha en el puerto definido.
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { getJwtSecret } = require('./src/config/auth.config');
const sanitize = require('./src/middleware/sanitize');

// ─── Validación de configuración (falla rápido y con mensaje claro) ────────────
try {
  getJwtSecret(); // JWT_SECRET obligatorio, mínimo 32 caracteres
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production';
const MONGO_URI = process.env.MONGO_URI || (!isProduction ? 'mongodb://localhost:27017/cultura_local' : null);

if (!MONGO_URI) {
  console.error('MONGO_URI no está definido. Configúralo en las variables de entorno.');
  process.exit(1);
}

if (isProduction && !process.env.CORS_ORIGIN) {
  console.warn('ADVERTENCIA: CORS_ORIGIN no está definido en producción; el frontend será bloqueado.');
}

const app = express();

// Render (y Cloudflare, si lo usas) están delante de la app: sin esto el rate limit
// vería la IP del proxy y bloquearía a todos los usuarios juntos.
// TRUST_PROXY = número de proxies (Render = 1; Render + Cloudflare = 2).
app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 1));

// Cabeceras de seguridad. "cross-origin" permite que el frontend cargue /img/* desde otro dominio.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Esta API no debe indexarse en buscadores
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// CORS: lista blanca estricta (sin excepciones por NODE_ENV)
// CORS_ORIGIN admite varias URLs separadas por coma, sin "/" final
const allowedOrigins = (process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
).map((origin) => origin.trim().replace(/\/+$/, '')).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origin (Postman, curl, health checks, Googlebot)
    if (!origin) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin));
  },
  credentials: true
}));

// Límite de tamaño del body (los archivos van por multer, no por aquí)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Elimina operadores NoSQL ($ne, $gt, ...) de body y query
app.use(sanitize);

// ─── Rutas sin rate limit (health check de Render, raíz, robots, estáticos) ────

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date()
  });
});

// Ruta raíz - evita error 5xx en Google Search Console
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Cultura Local'
  });
});

// Bloquear rastreo de Google en la API
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

// Imágenes antiguas (anteriores a Cloudinary)
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// ─── Rate limit general para la API ────────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes, intenta más tarde' }
}));

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const contactoRoutes = require('./src/routes/contacto.routes');
const eventosRoutes = require('./src/routes/eventos.routes');
const proyectosRoutes = require('./src/routes/proyectos.routes');
const blogRoutes = require('./src/routes/blog.routes');

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/blog', blogRoutes);

// Ruta no encontrada (SIEMPRE antes del manejador de errores)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores (SIEMPRE al final)
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 5000;
let server;

mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  });

// Cierre ordenado (Render envía SIGTERM en cada deploy)
const shutdown = (signal) => {
  console.log(`${signal} recibido, cerrando servidor...`);
  const closeDb = () => mongoose.connection.close(false).finally(() => process.exit(0));
  if (server) server.close(closeDb);
  else closeDb();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});
/**
 * generate-sitemap.mjs
 * Genera public/sitemap.xml en cada build del frontend.
 *
 * - Páginas fijas + /eventos/:id + /blog/:id (consultando la API pública).
 * - La API pública solo devuelve contenido publicado (sin borradores).
 * - Si la API no responde (dormida, caída), usa solo las páginas fijas.
 *   El build NUNCA falla por culpa del sitemap.
 *
 * Variables opcionales:
 *   SITE_URL      dominio canónico (por defecto https://www.culturalocal.cl)
 *   SITEMAP_API   URL base de la API (por defecto VITE_API_URL o https://api.culturalocal.cl)
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_URL = (process.env.SITE_URL || 'https://www.culturalocal.cl').replace(/\/+$/, '');
const API_URL = (process.env.SITEMAP_API || process.env.VITE_API_URL || 'https://api.culturalocal.cl')
  .replace(/\/+$/, '');

const TIMEOUT_MS = 60_000; // Render gratis puede tardar ~50 s en despertar
const REINTENTOS = 2;
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');

const hoy = new Date().toISOString().slice(0, 10);

const PAGINAS_FIJAS = [
  { ruta: '/', changefreq: 'weekly', priority: '1.0' },
  { ruta: '/proyectos', changefreq: 'weekly', priority: '0.9' },
  { ruta: '/eventos', changefreq: 'weekly', priority: '0.9' },
  { ruta: '/blog', changefreq: 'daily', priority: '0.8' },
  { ruta: '/practicas', changefreq: 'monthly', priority: '0.8' },
  { ruta: '/contacto', changefreq: 'monthly', priority: '0.7' },
];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const fechaISO = (valor) => {
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? hoy : d.toISOString().slice(0, 10);
};

async function pedirJSON(endpoint) {
  for (let intento = 1; intento <= REINTENTOS; intento++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        signal: ctrl.signal,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Respuesta inesperada (no es una lista)');
      return data;
    } catch (err) {
      console.warn(`[sitemap] ${endpoint} intento ${intento}/${REINTENTOS}: ${err.message}`);
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

const ID_VALIDO = /^[a-f0-9]{24}$/i;
const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function aUrls(lista, prefijo, changefreq, priority) {
  return (lista || [])
    .filter((item) => item && (SLUG_VALIDO.test(String(item.slug)) || ID_VALIDO.test(String(item._id))))
    .map((item) => ({
      loc: `${SITE_URL}${prefijo}/${SLUG_VALIDO.test(String(item.slug)) ? item.slug : item._id}`,
      lastmod: fechaISO(item.updatedAt || item.createdAt),
      changefreq,
      priority,
    }));
}

async function main() {
  const urls = PAGINAS_FIJAS.map((p) => ({
    loc: `${SITE_URL}${p.ruta === '/' ? '/' : p.ruta}`,
    lastmod: hoy,
    changefreq: p.changefreq,
    priority: p.priority,
  }));

  const [eventos, posts] = await Promise.all([pedirJSON('/api/eventos'), pedirJSON('/api/blog')]);

  if (eventos) urls.push(...aUrls(eventos, '/eventos', 'weekly', '0.7'));
  if (posts) urls.push(...aUrls(posts, '/blog', 'monthly', '0.6'));

  if (!eventos || !posts) {
    console.warn('[sitemap] La API no respondió del todo: se omitieron algunas URLs dinámicas.');
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          '  <url>\n' +
          `    <loc>${esc(u.loc)}</loc>\n` +
          `    <lastmod>${u.lastmod}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          '  </url>'
      )
      .join('\n') +
    '\n</urlset>\n';

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, xml, 'utf8');
  console.log(`[sitemap] ${urls.length} URLs escritas en public/sitemap.xml`);
}

main().catch((err) => {
  // Nunca romper el build: se conserva el sitemap que ya existe en public/
  console.warn(`[sitemap] Error inesperado, se conserva el sitemap actual: ${err.message}`);
});

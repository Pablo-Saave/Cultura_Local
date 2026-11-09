/**
 * AdminLayout.jsx - Estructura común del panel de administración
 * Barra lateral (logo + navegación) y barra superior (usuario + ver sitio).
 * Uso: <AdminLayout>contenido</AdminLayout>
 */

import { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// ── Iconos (SVG en línea, heredan el color del texto) ─────────────────
const Icon = ({ children, className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const IconDashboard = (p) => (
  <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>
);
export const IconBlog = (p) => (
  <Icon {...p}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h6" /></Icon>
);
export const IconEventos = (p) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></Icon>
);
export const IconProyectos = (p) => (
  <Icon {...p}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></Icon>
);
const IconLogout = (p) => (
  <Icon {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></Icon>
);
const IconMenu = (p) => (
  <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>
);
const IconClose = (p) => (
  <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>
);
const IconGlobe = (p) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></Icon>
);

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: IconDashboard },
  { name: 'Blog', path: '/admin/blog', icon: IconBlog },
  { name: 'Eventos', path: '/admin/eventos', icon: IconEventos },
  { name: 'Proyectos', path: '/admin/proyectos', icon: IconProyectos },
];

function AdminLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const inicial = (user?.nombre || 'A').charAt(0).toUpperCase();

  const linkClase = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ` +
    (isActive
      ? 'bg-white/20 text-white shadow-sm'
      : 'text-white/75 hover:bg-white/10 hover:text-white');

  const sidebar = (
    <div className="flex h-full flex-col bg-gradient-to-b from-primary-dark to-[#5E4F80] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <img
          src="/img/imagen12.png"
          alt="Cultura Local"
          className="h-11 w-11 rounded-full ring-2 ring-white/40 object-cover"
        />
        <div className="leading-tight">
          <p className="text-base font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
            CulturaLocal
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Panel admin</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Navegación del panel">
        <p className="px-3.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-white/50">
          Menú
        </p>
        {NAV_ITEMS.map(({ name, path, icon: ItemIcon }) => (
          <NavLink key={path} to={path} className={linkClase} onClick={() => setMenuAbierto(false)}>
            <ItemIcon />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="border-t border-white/15 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium
                     text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <IconLogout />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3FB]">
      {/* Barra lateral fija (pantallas grandes) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 lg:block min-[1600px]:w-64">
        {sidebar}
      </aside>

      {/* Barra lateral deslizable (móvil) */}
      {menuAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuAbierto(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">
            {sidebar}
            <button
              onClick={() => setMenuAbierto(false)}
              aria-label="Cerrar menú"
              className="absolute right-3 top-4 rounded-full p-1.5 text-white/80 hover:bg-white/10"
            >
              <IconClose />
            </button>
          </aside>
        </div>
      )}

      {/* Columna principal */}
      <div className="lg:pl-56 min-[1600px]:pl-64">
        {/* Barra superior */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-primary/10 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <button
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            className="rounded-lg p-2 text-primary-dark hover:bg-primary/10 lg:hidden"
          >
            <IconMenu />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold
                         text-white shadow-sm transition-colors hover:bg-accent-dark sm:text-sm"
            >
              <IconGlobe className="h-4 w-4" />
              <span className="hidden sm:inline">Ver sitio web</span>
              <span className="sm:hidden">Sitio</span>
            </Link>

            <div className="hidden h-8 w-px bg-primary/20 sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {inicial}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-primary-dark">{user?.nombre || 'Administrador'}</p>
                <p className="text-[11px] text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
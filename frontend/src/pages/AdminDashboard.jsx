/**
 * AdminDashboard.jsx - Panel de Administración
 * Dashboard principal para administradores (usa AdminLayout: barra lateral + superior)
 */

import { useContext, useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';
import AdminLayout, {
  IconDashboard,
  IconBlog,
  IconEventos,
  IconProyectos
} from '../components/AdminLayout';

// Ola decorativa de fondo en las tarjetas de estadísticas
const Ola = () => (
  <svg
    className="pointer-events-none absolute bottom-0 right-0 h-14 w-40 text-primary/15"
    viewBox="0 0 200 60" fill="currentColor" aria-hidden="true"
  >
    <path d="M0 60 C 40 5, 70 55, 110 32 S 170 0, 200 22 V60 Z" />
  </svg>
);

function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState({ blog: 0, eventos: 0, proyectos: 0 });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Obtener contadores
      const [blogRes, eventosRes, proyectosRes] = await Promise.all([
        axios.get(API_ENDPOINTS.blog),
        axios.get(API_ENDPOINTS.eventos),
        axios.get(API_ENDPOINTS.proyectos)
      ]);

      setStats({
        blog: blogRes.data.length,
        eventos: eventosRes.data.length,
        proyectos: proyectosRes.data.length
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3FB]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const tarjetas = [
    { titulo: 'Blog Posts', valor: stats.blog, icono: IconBlog },
    { titulo: 'Eventos', valor: stats.eventos, icono: IconEventos },
    { titulo: 'Proyectos', valor: stats.proyectos, icono: IconProyectos }
  ];

  const accesos = [
    { name: 'Blog', path: '/admin/blog', icono: IconBlog },
    { name: 'Eventos', path: '/admin/eventos', icono: IconEventos },
    { name: 'Proyectos', path: '/admin/proyectos', icono: IconProyectos }
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/30">
            <IconDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold leading-tight text-primary-dark min-[1600px]:text-3xl"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-500">
              Bienvenido, <span className="font-semibold text-primary-dark">{user.nombre}</span>
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tarjetas.map(({ titulo, valor, icono: Ico }) => (
            <div
              key={titulo}
              className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                <Ico className="h-6 w-6" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-gray-500">{titulo}</p>
                <p className="text-3xl font-bold text-primary-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {valor}
                </p>
              </div>
              <Ola />
            </div>
          ))}
        </div>

        {/* Gestión de contenidos */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10 sm:p-6">
          <h2
            className="mb-4 text-lg font-bold text-primary-dark min-[1600px]:text-xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Gestión de Contenidos
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {accesos.map(({ name, path, icono: Ico }) => (
              <Link
                key={path}
                to={path}
                className="group flex items-center gap-3 rounded-xl border border-primary/15 p-3.5
                           transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                  <Ico className="h-5 w-5" />
                </div>
                <div className="flex-1 leading-tight">
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-500">Gestionar</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary-dark transition-colors group-hover:bg-accent group-hover:text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
/**
 * AdminDashboard.jsx - Panel de Administración
 * Dashboard principal para administradores
 */

import { useContext, useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

function AdminDashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blog: 0,
    eventos: 0,
    proyectos: 0
  });

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
      console.error('Error al obtener estadísticas:', error);
    }
  };

  const handleLogout = () => {
    logout();
    // Redirigir al login
    navigate('/admin/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "'Aktifo A', sans-serif" }}>Panel de Administración</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenido, <span className="font-semibold">{user.nombre}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Blog Posts</h3>
            <p className="text-3xl font-bold text-primary mt-2">{stats.blog}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Eventos</h3>
            <p className="text-3xl font-bold text-primary mt-2">{stats.eventos}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Proyectos</h3>
            <p className="text-3xl font-bold text-primary mt-2">{stats.proyectos}</p>
          </div>
        </div>

        {/* Menú de administración */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-6" style={{ fontFamily: "'Aktifo A', sans-serif" }}>Gestión de Contenidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Blog', path: '/admin/blog', color: 'bg-blue-500' },
                { name: 'Eventos', path: '/admin/eventos', color: 'bg-green-500' },
                { name: 'Proyectos', path: '/admin/proyectos', color: 'bg-purple-500' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center p-4 rounded-lg border-2 border-gray-200 
                           hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Gestionar</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

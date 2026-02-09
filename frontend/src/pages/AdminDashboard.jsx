/**
 * AdminDashboard.jsx - Panel de Administración
 * Dashboard principal para administradores
 */

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {
  const { user, loading, logout } = useContext(AuthContext);

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
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenido, <span className="font-semibold">{user.nombre}</span> ({user.role})
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Blog Posts</h3>
            <p className="text-3xl font-bold text-primary mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Eventos</h3>
            <p className="text-3xl font-bold text-primary mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Proyectos</h3>
            <p className="text-3xl font-bold text-primary mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Prácticas</h3>
            <p className="text-3xl font-bold text-primary mt-2">0</p>
          </div>
        </div>

        {/* Menú de administración */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gestión de Contenidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Blog', path: '/admin/blog', color: 'bg-blue-500' },
                { name: 'Eventos', path: '/admin/eventos', color: 'bg-green-500' },
                { name: 'Proyectos', path: '/admin/proyectos', color: 'bg-purple-500' },
                { name: 'Prácticas Culturales', path: '/admin/practicas', color: 'bg-orange-500' },
                { name: 'Contacto', path: '/admin/contacto', color: 'bg-pink-500' },
                { name: 'Configuración', path: '/admin/settings', color: 'bg-gray-500' },
              ].map((item) => (
                <button
                  key={item.path}
                  className="flex items-center p-4 rounded-lg border-2 border-gray-200 
                           hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Gestionar</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info del usuario */}
        <div className="mt-8 bg-primary/10 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Información de Sesión</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Usuario:</span>
              <span className="ml-2 font-medium">{user.username}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Rol:</span>
              <span className="ml-2 font-medium capitalize">{user.role}</span>
            </div>
            <div>
              <span className="text-gray-600">Estado:</span>
              <span className="ml-2 font-medium text-green-600">Activo</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

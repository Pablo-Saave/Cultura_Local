/**
 * AdminLogin.jsx - Página de Login para Administradores
 * Ruta oculta para que los administradores inicien sesión
 */

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
      <div className="max-w-sm w-full mx-4">
        {/* Card de Login */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          {/* Logo/Título */}
          <div className="text-center mb-6">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-3">
              <svg className="w-8 h-8 text-primary" fill="none" strokeLinecap="round" 
                   strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-600">
              Fundación Cultura Local
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
                <p className="text-xs">{error}</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-primary focus:border-transparent transition-all"
                placeholder="Ingresa tu usuario"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-primary focus:border-transparent transition-all"
                placeholder="Ingresa tu contraseña"
                disabled={loading}
              />
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold 
                       py-2 px-4 text-sm rounded-lg transition-all duration-300 disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Info adicional */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Acceso restringido solo para personal autorizado
            </p>
          </div>
        </div>

        {/* Volver al inicio */}
        <div className="text-center mt-4">
          <a href="/" className="text-white hover:text-white/80 text-xs transition-colors">
            ← Volver al sitio web
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

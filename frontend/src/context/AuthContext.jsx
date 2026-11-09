/**
 * AuthContext.jsx - Contexto de Autenticación
 * Maneja el estado de autenticación del usuario en toda la aplicación
 */

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api.config';

export const AuthContext = createContext();

const AUTH_URL = `${API_URL}/api/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configurar axios con el token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${AUTH_URL}/verify`);
        setUser(response.data.data);
      } catch (error) {
        // Solo se descarta el token si el servidor lo rechaza.
        // Si la API está dormida o sin red, se conserva para no cerrar la sesión por error.
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('token');
          setToken(null);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${AUTH_URL}/login`, {
        username,
        password
      });

      const { token: newToken, user: userData } = response.data.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
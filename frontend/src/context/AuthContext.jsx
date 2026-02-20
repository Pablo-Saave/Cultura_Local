/**
 * AuthContext.jsx - Contexto de Autenticación
 * Maneja el estado de autenticación del usuario en toda la aplicación
 */

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/auth';

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
        const response = await axios.get(`${API_URL}/verify`);
        setUser(response.data.data);
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        setToken(null);
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
      console.log('Intentando login con:', { username, url: `${API_URL}/login` });
      
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });

      console.log('Respuesta del servidor:', response.data);

      const { token: newToken, user: userData } = response.data.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al iniciar sesión'
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

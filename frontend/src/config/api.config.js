/**
 * api.config.js - Configuración de API
 * Configuración centralizada para las URLs de la API
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  
  // Eventos
  eventos: `${API_URL}/api/eventos`,
  eventoById: (id) => `${API_URL}/api/eventos/${id}`,
  
  // Proyectos
  proyectos: `${API_URL}/api/proyectos`,
  proyectoById: (id) => `${API_URL}/api/proyectos/${id}`,
  
  // Blog
  blog: `${API_URL}/api/blog`,
  blogById: (id) => `${API_URL}/api/blog/${id}`,
  
  // Contacto
  contacto: `${API_URL}/api/contacto`,
  
  // Health
  health: `${API_URL}/api/health`
};

// Helper para construir URLs de imágenes
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

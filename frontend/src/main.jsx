/**
 * main.jsx - Punto de entrada de React
 * Punto de entrada de React. Importa estilos globales, renderiza <App /> 
 * en el DOM usando createRoot().
 */

// Importamos React para usar JSX
import React from 'react'
// Importamos ReactDOM para montar la aplicación en el DOM
import ReactDOM from 'react-dom/client'
// Componente principal de la aplicación
import App from './App.jsx'
// Estilos globales con Tailwind CSS
import './index.css'
// Provider para react-helmet-async (SEO)
import { HelmetProvider } from 'react-helmet-async'

// Obtenemos el elemento del DOM donde montaremos la aplicación
// createRoot es la nueva API de React 18 para renderizar
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode activa validaciones adicionales en desarrollo
  // Ayuda a detectar problemas potenciales en la aplicación
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)

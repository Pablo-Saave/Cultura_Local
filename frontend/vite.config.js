/**
 * vite.config.js - Configuraci�n de Vite
 * Configuraci�n de Vite. Define plugins (React), puerto del servidor de desarrollo, 
 * alias de rutas y opciones de build.
 */
// Importamos el helper para definir la configuración
import { defineConfig } from 'vite'
// Plugin oficial de Vite para React con Fast Refresh
import react from '@vitejs/plugin-react'

// Exportamos la configuración de Vite
export default defineConfig({
  // Array de plugins - usamos el plugin de React para JSX y Fast Refresh
  plugins: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 5173, // Puerto en el que corre el frontend
    open: true // Abre el navegador automáticamente al iniciar
  }
})

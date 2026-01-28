/**
 * tailwind.config.js - Configuraci�n de Tailwind CSS
 * Configuraci�n de Tailwind CSS. Personaliza colores, fuentes, espaciados, 
 * breakpoints y habilita plugins.
 */
export default {
  // Configuración de modo oscuro - usa la clase 'dark' en el elemento HTML
  darkMode: 'class',
  
  // Archivos donde Tailwind buscará clases para generar el CSS final
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // Colores personalizados basados en el diseño de Fundación Cultura Local
      colors: {
        // Color morado principal de la marca - tono más morado
        primary: {
          DEFAULT: '#9381B5', // Morado principal
          light: '#A796C5',   // Morado claro
          dark: '#7A6A9E'     // Morado oscuro
        },
        // Color dorado para botones y acentos
        accent: {
          DEFAULT: '#D4AF37', // Dorado
          light: '#E5C158',   // Dorado claro
          dark: '#B8941F'     // Dorado oscuro
        },
        // Colores para modo oscuro
        dark: {
          bg: '#1e293b',      // Fondo principal oscuro unificado
          card: '#1e293b',    // Fondo de tarjetas oscuro unificado
          text: '#e4e4e4'     // Texto en modo oscuro
        }
      },
      // Fuentes personalizadas
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}

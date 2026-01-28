/**
 * App.jsx - Componente raíz de la aplicación
 * Componente raíz de la aplicación. Define el sistema de rutas (React Router), 
 * layout general (Navbar, Footer) y páginas principales.
 */

// Importamos React y hooks necesarios
import { useState, useEffect } from 'react'
// Importamos el sistema de rutas de React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Importamos los componentes de layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Importamos las páginas
import Home from './pages/Home'
import BuscarPractica from './pages/BuscarPractica'
import Presentacion from './pages/Presentacion'
import Publicaciones from './pages/Publicaciones'
import Eventos from './pages/Eventos'
import Blog from './pages/Blog'
import Contacto from './pages/Contacto'
import Practicas from './pages/Practicas'
import Proyectos from './pages/Proyectos'

function App() {
  // Estado para controlar el modo oscuro
  // Inicializamos desde localStorage o por defecto false (modo claro)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  // Efecto que se ejecuta cuando cambia darkMode
  // Actualiza la clase 'dark' en el elemento html y guarda en localStorage
  useEffect(() => {
    if (darkMode) {
      // Agrega la clase 'dark' al elemento html para activar estilos oscuros
      document.documentElement.classList.add('dark')
    } else {
      // Remueve la clase 'dark' para modo claro
      document.documentElement.classList.remove('dark')
    }
    // Guardamos la preferencia del usuario en localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Función para alternar entre modo claro y oscuro
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  return (
    // Router envuelve toda la aplicación para habilitar navegación
    <Router>
      {/* Contenedor principal con fondo que cambia según el tema */}
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg theme-transition">
        {/* Navbar fijo en la parte superior */}
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Contenedor principal del contenido */}
        <main className="pt-20">
          {/* Definimos las rutas de la aplicación */}
          <Routes>
            {/* Ruta principal - Presentación */}
            <Route path="/" element={<Presentacion />} />
            {/* Ruta de buscar práctica */}
            <Route path="/buscar" element={<BuscarPractica />} />
            {/* Ruta de presentación */}
            <Route path="/presentacion" element={<Presentacion />} />
            {/* Ruta de publicaciones */}
            <Route path="/publicaciones" element={<Publicaciones />} />
            {/* Ruta de eventos */}
            <Route path="/eventos" element={<Eventos />} />
            {/* Ruta del blog */}
            <Route path="/blog" element={<Blog />} />
            {/* Ruta de contacto */}
            <Route path="/contacto" element={<Contacto />} />
            {/* Ruta de prácticas */}
            <Route path="/practicas" element={<Practicas />} />
            {/* Ruta de proyectos */}
            <Route path="/proyectos" element={<Proyectos />} />
          </Routes>
        </main>
        
        {/* Footer al final de la página */}
        <Footer />
      </div>
    </Router>
  )
}

export default App

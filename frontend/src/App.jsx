/**
 * App.jsx - Componente raíz de la aplicación
 * Componente raíz de la aplicación. Define el sistema de rutas (React Router), 
 * layout general (Navbar, Footer) y páginas principales.
 */

// Importamos React y hooks necesarios
import { useState, useEffect } from 'react'
// Importamos el sistema de rutas de React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Importamos el contexto de autenticación
import { AuthProvider } from './context/AuthContext'

// Importamos los componentes de layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Importamos las páginas públicas
import Home from './pages/Home'
import BuscarPractica from './pages/BuscarPractica'
import Presentacion from './pages/Presentacion'
import Publicaciones from './pages/Publicaciones'
import Eventos from './pages/Eventos'
import Blog from './pages/Blog'
import BlogDetalle from './pages/BlogDetalle'
import Contacto from './pages/Contacto'
import Practicas from './pages/Practicas'
import Proyectos from './pages/Proyectos'

// Importamos las páginas de administración
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminBlog from './pages/AdminBlog'

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
      <AuthProvider>
        {/* Contenedor principal con fondo que cambia según el tema */}
        <div className="min-h-screen bg-white dark:bg-dark-bg theme-transition">
          {/* Definimos las rutas de la aplicación */}
          <Routes>
            {/* Rutas de administración (sin navbar/footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            
            {/* Rutas públicas (con navbar/footer) */}
            <Route path="/*" element={
              <>
                <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <main className="pt-20">
                  <Routes>
                    <Route path="/" element={<Presentacion />} />
                    <Route path="/buscar" element={<BuscarPractica />} />
                    <Route path="/presentacion" element={<Presentacion />} />
                    <Route path="/publicaciones" element={<Publicaciones />} />
                    <Route path="/eventos" element={<Eventos />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetalle />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/practicas" element={<Practicas />} />
                    <Route path="/proyectos" element={<Proyectos />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App

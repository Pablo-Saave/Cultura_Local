
// Importamos React y hook para estado y efectos
import { useState, useEffect } from 'react'
// Importamos Link para navegación sin recargar la página
import { Link, useLocation } from 'react-router-dom'


function Navbar({ darkMode, toggleDarkMode }) {
 
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Si está en la parte superior, siempre mostrar la navbar
      if (currentScrollY < 10) {
        setIsVisible(true)
      }
      // Si hace scroll hacia abajo, ocultar navbar
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
        setIsOpen(false) // Cerrar menú móvil si está abierto
      }
      // Si hace scroll hacia arriba, mostrar navbar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    // Agregar listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Limpiar listener cuando se desmonte el componente
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    // Nav fixed para que esté siempre visible al hacer scroll
    <nav className={`fixed w-full top-0 z-50 theme-transition transition-transform duration-500 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="flex justify-between items-center h-16">
        
        {/* Logo con franja integrada */}
        <Link to="/" className="relative z-10 flex items-center group bg-primary h-full px-8">
          
          <div className="text-white relative z-10">
            <div className="font-serif text-2xl leading-none tracking-tight">
              <span className="font-light">Cultura</span>
              <span className="font-normal">Local</span>
            </div>
            <div className="text-right text-[0.5rem] font-sans tracking-widest opacity-70 mt-0.5">
              FUNDACIÓN
            </div>
          </div>
          
        </Link>
        
        {/* Contenedor derecho con fondo */}
        <div className="flex-1 flex justify-end items-center h-full bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        
          {/* Menú desktop - oculto en móvil */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Array de enlaces del menú */}
            {[ 
              { name: 'PRESENTACIÓN', path: '/presentacion' },
              { name: 'PROYECTOS', path: '/proyectos' },
              { name: 'EVENTOS', path: '/eventos' },
              { name: 'BLOG', path: '/blog' },
              { name: 'PRÁCTICAS CULTURALES', path: '/practicas' },
            ].map((item) => (
              // Cada enlace del menú
              <Link
                key={item.path}
                to={item.path}
                onClick={scrollToTop}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors
                          ${isActive(item.path)
                            ? 'text-primary dark:text-primary-light'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light'
                          }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Botón de contacto con estilo destacado */}
            <Link
              to="/contacto"
              className="ml-4 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-full 
                         font-bold transition-all duration-300 text-xs"
            >
              CONTACTO
            </Link>

            {/* Botón de toggle para modo oscuro */}
            <button
              onClick={toggleDarkMode}
              className="ml-10 p-2 transition-colors"
              aria-label="Cambiar modo oscuro"
            >
              {/* Icono de sol o luna según el modo actual */}
              {darkMode ? (
                // Icono de sol para modo claro
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                // Icono de luna para modo oscuro
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Botón hamburguesa para móvil */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Botón de modo oscuro en móvil */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-700"
              aria-label="Cambiar modo oscuro"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Menú"
            >
              {}
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" 
                   strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  // Icono X para cerrar
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        </div>

        {/* Menú móvil desplegable */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex flex-col space-y-2 px-4">
              {/* Enlaces del menú móvil */}
              {[ 
                { name: 'PRESENTACIÓN', path: '/presentacion' },
                { name: 'PROYECTOS', path: '/proyectos' },
                { name: 'EVENTOS', path: '/eventos' },
                { name: 'BLOG', path: '/blog' },
                  { name: 'PRÁCTICAS CULTURALES', path: '/practicas' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setIsOpen(false)
                    scrollToTop()
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                            ${isActive(item.path)
                              ? 'text-primary dark:text-primary-light'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Botón de contacto en móvil */}
<Link
                to="/contacto"
                onClick={() => {
                  setIsOpen(false)
                  scrollToTop()
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors bg-accent hover:bg-accent-dark text-white
                            ${isActive('/contacto') ? 'bg-accent-dark' : ''}`}
              >
                CONTACTO
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

// Importamos Link para navegación
import { Link } from 'react-router-dom'

function Footer() {
  return (
    // Footer con fondo que cambia según el tema
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className="mb-4">
              <span className="text-lg font-display font-semibold text-gray-900 dark:text-white">
                Fundacion Cultura Local
              </span>
            </div>
            
            {/* Descripción de la fundación */}
            <p className="text-sm leading-relaxed">
              Potenciamos la cultura local a través de la participación juvenil 
              y el rescate de nuestras prácticas territoriales.
            </p>
            
            {/* Iconos de redes sociales */}
            <div className="flex space-x-4 mt-6">
              {/* Instagram */}
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Secciones del sitio */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">SECCIONES</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/presentacion" className="hover:text-primary transition-colors">
                  Presentación
                </Link>
              </li>
              <li>
                <Link to="/publicaciones" className="hover:text-primary transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="hover:text-primary transition-colors">
                  Nuestros Eventos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog Cultural
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">CONTACTO</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                {/* Icono de email */}
                <svg className="w-5 h-5 text-primary" fill="none" strokeLinecap="round" 
                     strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:contacto.culturalocal@gmail.com" className="hover:text-primary transition-colors">
                  contacto.culturalocal@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                {/* Icono de ubicación */}
                <svg className="w-5 h-5 text-primary" fill="none" strokeLinecap="round" 
                     strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Concepción, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © 2025 FUNDACIÓN CULTURA LOCAL. TODOS LOS DERECHOS RESERVADOS.
            </p>
            
            {/* Enlaces legales */}
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                PRIVACIDAD
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                TÉRMINOS
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

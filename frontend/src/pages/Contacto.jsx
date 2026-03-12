/**
 * Contacto.jsx - P�gina de contacto
 * P�gina de contacto con formulario, informaci�n de ubicaci�n y redes sociales.
 */
import SEO from '../components/SEO'

function Contacto() {
  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <SEO 
        title="Contacto"
        description="Contáctanos para colaboraciones, proyectos culturales o consultas sobre Fundación Cultura Local. Estamos en La Serena, Chile."
        keywords="contacto cultura local, colaboración cultural, proyectos culturales la serena, fundación cultura contacto"
      />
      <div className="max-w-4xl mx-auto">
<h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light mb-6" style={{fontFamily: 'Aktifo A, sans-serif'}}>
          Contacto
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          ¿Tienes un proyecto cultural? ¿Quieres colaborar con nosotros? 
          Estamos aquí para escucharte.
        </p>
        
        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img 
              src="/img/imagen12.png" 
              alt="Fundación Cultura Local"
              className="w-full h-auto"
            />
          </div>
          
          {/* Información de contacto */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Información de Contacto
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-primary mt-1" fill="none" strokeLinecap="round" 
                   strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contacto.culturalocal@gmail.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  contacto.culturalocal@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-primary mt-1" fill="none" strokeLinecap="round" 
                   strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Ubicación</p>
                <a 
                  href="https://www.google.com/maps/place/Concepción,+Chile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer"
                >
                  Concepción, Chile
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-primary mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Instagram</p>
                <a href="https://www.instagram.com/fundacionculturalocal" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @fundacionculturalocal
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Contacto

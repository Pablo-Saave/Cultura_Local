/**
 * Publicaciones.jsx - Página de proyectos
 * Página que muestra los proyectos de la fundación
 */

function Publicaciones() {
  // Array de proyectos
  const proyectos = [
    {
      id: 1,
      slug: 'creadoras-chile',
      nombre: 'Creadoras Chile',
      descripcion: 'Plataforma que visibiliza y conecta a mujeres creadoras de Chile',
      imagen: '/img/logo.jpeg',
      link: 'https://creadoraschile.cl/'
    },
    {
      id: 2,
      slug: 'concepcion-reversiones',
      nombre: 'Concepción: Reversiones Fotográficas',
      descripcion: 'Portafolio fotográfico que explora la ciudad de Concepción a través de reversiones visuales',
      imagen: '/img/proyecto2.png',
      link: 'https://gustavoburgos.cl/concepcion-reversiones-fotograficas'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <h1 className="text-5xl md:text-6xl font-bold text-primary dark:text-primary-light mb-4" style={{fontFamily: 'Aktifo A, sans-serif'}}>
          Proyectos
        </h1>
        {/* Subrayado dorado */}
        <div className="w-32 h-1 bg-accent mb-6"></div>
        
        {/* Subtítulo */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-4xl">
          Explora las iniciativas que estamos impulsando para transformar nuestro entorno a través del arte, la educación y la cultura local.
        </p>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <a
              key={proyecto.id}
              href={proyecto.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white dark:bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                {/* Logo del proyecto */}
                <div className="aspect-square bg-white dark:bg-white flex items-center justify-center p-8">
                  <img 
                    src={proyecto.imagen} 
                    alt={proyecto.nombre}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Si la imagen no carga, mostrar placeholder con el nombre
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `<div class="text-white text-4xl font-bold text-center">${proyecto.nombre}</div>`
                    }}
                  />
                </div>
                
                {/* Información del proyecto */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {proyecto.nombre}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-600 text-sm">
                    {proyecto.descripcion}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Sección de Instagram */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-primary dark:text-primary-light mb-4" style={{fontFamily: 'Aktifo A, sans-serif'}}>
            Instagram
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 dark:bg-dark-bg rounded-xl p-8">
            {/* Logo de la fundación */}
            <div className="w-48 h-48 flex-shrink-0">
              <img 
                src="/img/imagen12.png" 
                alt="Fundación Cultura Local"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Contenido */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                Síguenos en Instagram para estar al tanto de nuestras actividades y proyectos culturales.
              </p>
              <p className="text-gray-600 dark:text-gray-400 italic mb-6">
                Próximamente compartiremos contenido exclusivo sobre nuestras iniciativas.
              </p>
              <a
                href="https://www.instagram.com/fundacionculturalocal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Síguenos @fundacionculturalocal
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Publicaciones

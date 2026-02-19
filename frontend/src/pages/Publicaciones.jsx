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
      </div>
    </div>
  )
}

export default Publicaciones

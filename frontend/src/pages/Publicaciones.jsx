/**
 * Publicaciones.jsx - Página de publicaciones
 * Página que muestra galería de publicaciones culturales con filtros y tarjetas.
 * Diseño basado en la imagen proporcionada por el usuario.
 */

// Importamos React y hooks necesarios
import { useState } from 'react'

// Componente principal de la página Publicaciones
function Publicaciones() {
  // Estado para el filtro activo - por defecto 'Todo'
  const [filtroActivo, setFiltroActivo] = useState('Todo')
  
  // Estado para controlar cuántas publicaciones mostrar
  const [mostrarCantidad, setMostrarCantidad] = useState(6)

  // Array de categorías para los filtros
  const categorias = ['Todo', 'Cartografía', 'Fotografía', 'Arte Visual', 'Relatos']

  // Array de publicaciones con todos sus datos
  // En producción esto vendría de una API/base de datos
  const publicaciones = [
    {
      id: 1,
      titulo: 'Cartografía Crítica del Centro',
      autor: 'Por Camila Rivas',
      fecha: 'Septiembre 2023',
      descripcion: 'Un análisis visual de los espacios de reunión juvenil en el casco histórico de la ciudad.',
      categoria: 'Cartografía',
      imagen: '/img/mapa.jpg', // Placeholder - reemplazar con imagen real
      etiqueta: 'MAPA',
      colorEtiqueta: 'bg-yellow-500',
      colorFondo: 'bg-red-700'
    },
    {
      id: 2,
      titulo: 'Laguna de las Tres Pascualas',
      autor: 'Por Diego Méndez',
      fecha: 'Agosto 2023',
      descripcion: 'Mapeo sensorial de la biodiversidad local y su integración con el barrio universitario.',
      categoria: 'Cartografía',
      imagen: '/img/laguna.jpg',
      etiqueta: 'URBANISMO',
      colorEtiqueta: 'bg-yellow-500',
      colorFondo: 'bg-blue-400'
    },
    {
      id: 3,
      titulo: 'Identidades Disidentes',
      autor: 'Por Martina Soto',
      fecha: 'Julio 2023',
      descripcion: 'Exploración gráfica sobre la identidad local y el retrato como herramienta de empoderamiento.',
      categoria: 'Arte Visual',
      imagen: '/img/retrato.jpg',
      etiqueta: 'ARTE',
      colorEtiqueta: 'bg-yellow-500',
      colorFondo: 'bg-gray-400'
    },
    {
      id: 4,
      titulo: 'Luces del Patrimonio',
      autor: 'Por Lucas Peña',
      fecha: 'Junio 2023',
      descripcion: 'Serie fotográfica que captura la arquitectura local bajo la dorada luz del invierno.',
      categoria: 'Fotografía',
      imagen: '/img/calle.jpg',
      etiqueta: 'FOTOGRAFÍA',
      colorEtiqueta: 'bg-yellow-500',
      colorFondo: 'bg-gray-600'
    },
    {
      id: 5,
      titulo: 'Muros que Hablan',
      autor: 'Por Colectivo Brote',
      fecha: 'Mayo 2023',
      descripcion: 'Registro visual del muralismo participativo realizado en el Barrio Norte.',
      categoria: 'Arte Visual',
      imagen: '/img/mural.jpg',
      etiqueta: 'COMUNIDAD',
      colorEtiqueta: 'bg-yellow-500',
      colorFondo: 'bg-teal-500'
    },
    {
      id: 6,
      titulo: 'Relatos del Mercado',
      autor: 'Por Ana Vargas',
      fecha: 'Abril 2023',
      descripcion: 'Historias orales de comerciantes que dan vida al mercado central desde hace décadas.',
      categoria: 'Relatos',
      imagen: '/img/mercado.jpg',
      etiqueta: 'HISTORIAS',
      colorEtiqueta: 'bg-yellow-500',
      colorFondo: 'bg-orange-500'
    },
  ]

  // Función para filtrar publicaciones según la categoría seleccionada
  const publicacionesFiltradas = filtroActivo === 'Todo'
    ? publicaciones
    : publicaciones.filter(pub => pub.categoria === filtroActivo)

  // Limitamos las publicaciones mostradas según el estado
  const publicacionesMostradas = publicacionesFiltradas.slice(0, mostrarCantidad)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-dark-bg dark:to-dark-card theme-transition">
      {/* Sección hero con título y descripción */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Título principal */}
          <h1 className="text-6xl md:text-7xl font-display font-bold text-primary dark:text-primary-light mb-6">
            Proyectos
          </h1>
          
          {/* Descripción */}
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mb-12">
            Explora las prácticas culturales y expresiones creativas de nuestra comunidad joven. 
            Un espacio para el intercambio y el reconocimiento local.
          </p>

          {/* Filtros de categorías */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => {
                  setFiltroActivo(categoria)
                  setMostrarCantidad(6) // Reset al cambiar filtro
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300
                          ${filtroActivo === categoria
                            ? 'bg-primary text-white shadow-lg scale-105'
                            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
              >
                {categoria}
              </button>
            ))}
          </div>

          {/* Grid de tarjetas de publicaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {publicacionesMostradas.map((publicacion) => (
              // Tarjeta individual de publicación
              <article
                key={publicacion.id}
                className="card group cursor-pointer"
              >
                {/* Contenedor de imagen con etiqueta */}
                <div className={`relative h-64 ${publicacion.colorFondo} overflow-hidden`}>
                  {/* Placeholder de imagen - reemplazar con imagen real */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/30 text-sm">Imagen: {publicacion.titulo}</span>
                  </div>
                  
                  {/* Etiqueta de categoría en la esquina superior derecha */}
                  <span className={`absolute top-4 right-4 ${publicacion.colorEtiqueta} 
                                  text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                    {publicacion.etiqueta}
                  </span>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6">
                  {/* Título de la publicación */}
                  <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2 
                               group-hover:text-primary transition-colors">
                    {publicacion.titulo}
                  </h3>
                  
                  {/* Autor y fecha */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {publicacion.autor} — {publicacion.fecha}
                  </p>
                  
                  {/* Descripción */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {publicacion.descripcion}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Botón Cargar Más - solo se muestra si hay más publicaciones */}
          {mostrarCantidad < publicacionesFiltradas.length && (
            <div className="flex justify-center">
              <button
                onClick={() => setMostrarCantidad(prev => prev + 6)}
                className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-dark-card 
                         text-gray-700 dark:text-gray-300 rounded-full border-2 border-gray-300 
                         dark:border-gray-600 hover:border-primary hover:text-primary 
                         transition-all duration-300"
              >
                {/* Icono de plus */}
                <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" 
                     strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                CARGAR MÁS
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Publicaciones

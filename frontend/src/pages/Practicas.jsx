/**
 * Practicas.jsx - Pagina de practicas culturales
 * Pagina sobre practicas culturales, metodologias o servicios ofrecidos.
 */
import SEO from '../components/SEO'

function Practicas() {
  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <SEO 
        title="Prácticas Culturales"
        description="Conoce las metodologías y prácticas que utilizamos para el rescate y difusión del patrimonio cultural local en Chile."
        keywords="prácticas culturales, metodologías culturales, patrimonio cultural local, rescate cultural"
      />
      <div className="max-w-7xl mx-auto">
<h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light mb-6" style={{fontFamily: 'Aktifo A, sans-serif'}}>
          Prácticas Culturales
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
          Conoce las metodologías y prácticas que utilizamos para el rescate 
          y difusión del patrimonio cultural local.
        </p>
        
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            Contenido en desarrollo
          </p>
        </div>
      </div>
    </div>
  )
}

export default Practicas

/**
 * Eventos.jsx - Pagina de eventos
 * Pagina que lista eventos proximos y pasados, consume endpoint /eventos del backend.
 */
function Eventos() {
  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
<h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light mb-6" style={{fontFamily: 'Aktifo A, sans-serif'}}>
          Nuestros Eventos
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
          Descubre los próximos encuentros culturales, talleres y actividades comunitarias 
          que organizamos para fortalecer nuestra identidad local.
        </p>
        
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            Próximamente: calendario de eventos
          </p>
        </div>
      </div>
    </div>
  )
}

export default Eventos

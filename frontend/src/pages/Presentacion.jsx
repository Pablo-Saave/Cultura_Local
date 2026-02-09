/**
 * Presentacion.jsx - Página de presentación
 * Página que presenta la fundación, su misión y equipo
 */

function Presentacion() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Título principal */}
        <h1 className="text-5xl font-display font-bold text-primary mb-16">
          Presentación
        </h1>

        {/* Sección principal con logo y descripción */}
        <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start mb-20">
          
          {/* Logo cuadrado */}
          <div className="bg-primary flex items-center justify-center aspect-square rounded-lg p-6">
            <div className="text-white text-center">
              <div className="font-display font-bold text-2xl leading-tight">
                FUNDACIÓN
              </div>
              <div className="font-display font-bold text-2xl leading-tight mt-1">
                CULTURA
              </div>
              <div className="font-display font-bold text-2xl leading-tight mt-1">
                LOCAL
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-6">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              <strong className="text-primary">Fundación Cultura Local</strong> es un proyecto colaborativo 
              impulsado por un equipo interdisciplinario comprometido con relevar, investigar y difundir 
              la labor cultural en Chile, con especial énfasis en lo desarrollado durante el siglo XXI. 
              Nuestro objetivo es visibilizar los aportes culturales que, desde distintas regiones del país, 
              han contribuido a la construcción de identidad, muchas veces al margen de los relatos oficiales 
              de la historia cultural nacional.
            </p>

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              Nuestro equipo está conformado por gestores culturales, artistas, investigadores, periodistas 
              y profesionales de diversas áreas unidos por el interés común de reconocer el trabajo de las 
              comunidades que han aportado al paisaje cultural desde su oficio y vocación.
            </p>
          </div>
        </div>

        {/* Sección de equipo */}
        <div className="mt-20">
          <h2 className="text-4xl font-display font-bold text-primary mb-12">
            Equipo
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
            {/* Placeholder para miembros del equipo */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="text-center">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-square rounded-lg mb-3"></div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Nombre del Miembro</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cargo / Rol</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Presentacion

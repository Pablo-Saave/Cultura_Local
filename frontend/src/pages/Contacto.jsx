/**
 * Contacto.jsx - P�gina de contacto
 * P�gina de contacto con formulario, informaci�n de ubicaci�n y redes sociales.
 */
function Contacto() {
  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-primary dark:text-primary-light mb-6">
          Contacto
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          ¿Tienes un proyecto cultural? ¿Quieres colaborar con nosotros? 
          Estamos aquí para escucharte.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12">
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
                  <a href="mailto:hola@culturaloca.cl" className="text-primary hover:underline">
                    hola@culturaloca.cl
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
                  <p className="text-gray-700 dark:text-gray-300">Concepción, Chile</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Envíanos un mensaje
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Formulario de contacto próximamente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contacto

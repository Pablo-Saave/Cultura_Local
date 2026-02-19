/**
 * BuscarPractica.jsx - Página de práctica profesional
 * Información sobre práctica profesional para estudiantes de arquitectura
 */

function BuscarPractica() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto text-center">
<h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light mb-6" style={{fontFamily: 'Aktifo A, sans-serif'}}>
            Práctica Profesional en Arquitectura
          </h1>
        </div>
      </section>

      {/* Área de trabajo */}
      <section className="py-16 px-4 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-8 text-gray-900 dark:text-white">
            Área de Investigación
          </h2>
          <div className="p-8 border-l-4 border-primary">
            <h3 className="text-xl font-semibold mb-4 text-primary dark:text-primary-light">
              Actividades principales:
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-primary mr-3">•</span>
                <span>Elaboración de planos técnicos y levantamientos arquitectónicos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">•</span>
                <span>Documentación y análisis de patrimonio cultural y arquitectónico</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">•</span>
                <span>Apoyo en proyectos de investigación en curso</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3">•</span>
                <span>Colaboración con equipo multidisciplinario</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-16 px-4 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-8 text-gray-900 dark:text-white">
            Requisitos
          </h2>
          <div className="p-8 border-l-4 border-primary">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span>Ser estudiante universitario de Arquitectura</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span>Tener la práctica profesional pendiente en tu malla curricular</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span>Disponibilidad para realizar las horas requeridas por tu universidad</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span>Manejo de software de diseño y planimetría (AutoCAD, Revit, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span>Interés en patrimonio cultural e investigación</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-16 px-4 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-gray-900 dark:text-white">
            Postula Ahora
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Completa el formulario y nos pondremos en contacto contigo
          </p>
          
          {/* Reemplaza GOOGLE_FORM_URL con tu URL real */}
          <a 
            href="GOOGLE_FORM_URL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Ir al Formulario de Postulación
          </a>
          
          {/* Alternativa: Embed del formulario */}
          {/* <div className="mt-8 max-w-3xl mx-auto">
            <iframe 
              src="GOOGLE_FORM_EMBED_URL" 
              width="100%" 
              height="800" 
              frameBorder="0" 
              marginHeight="0" 
              marginWidth="0"
              className="rounded-lg shadow-lg"
            >
              Cargando…
            </iframe>
          </div> */}
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 px-4 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-gray-900 dark:text-white">
            ¿Tienes dudas?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Escríbenos a{' '}
            <a 
              href="mailto:contacto.culturalocal@gmail.com" 
              className="text-primary hover:underline font-semibold"
            >
              contacto.culturalocal@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default BuscarPractica

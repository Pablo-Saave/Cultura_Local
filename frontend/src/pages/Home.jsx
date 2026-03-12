/**
 * Home.jsx - Pagina de inicio
 * PPagina de inicio. Hero section, introduccion al proyecto y destacados.
 */
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

function Home() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Inicio"
        description="Fundación Cultura Local - Potenciamos la cultura local a través de la participación juvenil y el rescate de nuestras prácticas territoriales en Chile."
        keywords="fundación cultura local, cultura chilena, participación juvenil, prácticas territoriales, patrimonio cultural chile"
      />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Contenido del hero */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6" style={{fontFamily: 'Aktifo A, sans-serif'}}>
            Fundacion<br/>Cultura Local
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Potenciamos la cultura local a través de la participación juvenil 
            y el rescate de nuestras prácticas territoriales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/publicaciones" className="btn-accent text-lg">
              Explorar Publicaciones
            </Link>
            <Link to="/contacto" className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 
                                           rounded-full font-semibold transition-all">
              Conoce Más
            </Link>
          </div>
        </div>
      </section>


    </div>
  )
}

export default Home

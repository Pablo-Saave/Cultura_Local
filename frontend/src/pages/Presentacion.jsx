/**
 * Presentacion.jsx - Página de presentación
 * Página que presenta la fundación, su misión y equipo
 */

import { useState, useEffect } from 'react'
import SEO from '../components/SEO'

function Presentacion() {
  // Estado para el carrusel de imágenes
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Array de imágenes del carrusel
  const carouselImages = [
    '/img/slide1.jpeg',
    '/img/slide2.jpeg',
    '/img/slide3.jpeg'
  ]
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [carouselImages.length])
  
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <SEO 
        title="Presentación"
        description="Fundación Cultura Local es una organización dedicada al rescate y promoción de prácticas culturales territoriales mediante la participación juvenil en Chile."
        keywords="fundación cultura local, presentación, misión cultural, organización cultural chile, participación juvenil cultura"
      />
      {/* Carrusel en móvil */}
      <div className="md:hidden">
        <div className="relative w-full overflow-hidden -mt-16 h-[320px]">
          {/* Imágenes */}
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 40%' }}
                onError={(e) => {
                  e.target.src = ''
                  e.target.parentElement.classList.add('bg-gray-200', 'dark:bg-gray-700')
                  e.target.parentElement.innerHTML += '<div class="absolute inset-0 flex items-center justify-center text-gray-400">Imagen ' + (index + 1) + '</div>'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Carrusel en desktop - ancho completo */}
      <div className="hidden md:block max-w-7xl mx-auto px-0 lg:px-8">
        <div className="relative w-full overflow-hidden -mt-16 lg:-mt-20 h-96 md:h-[420px] lg:h-[480px]">
          {/* Imágenes */}
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 40%' }}
                onError={(e) => {
                  e.target.src = ''
                  e.target.parentElement.classList.add('bg-gray-200', 'dark:bg-gray-700')
                  e.target.parentElement.innerHTML += '<div class="absolute inset-0 flex items-center justify-center text-gray-400">Imagen ' + (index + 1) + '</div>'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">

        {/* Sección principal con logo y descripción */}
        <div className="grid md:grid-cols-[300px_1fr] gap-6 sm:gap-8 items-start mb-12 sm:mb-16 md:mb-20">
          
          {/* Logo imagen */}
          <div className="flex items-center justify-center rounded-lg overflow-hidden mx-auto md:mx-0 w-48 sm:w-56 md:w-full">
            <img 
              src="/img/imagen12.png" 
              alt="Fundación Cultura Local"
              className="w-full h-auto"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
              <strong className="text-primary">Fundación Cultura Local</strong> es un proyecto colaborativo 
              impulsado por un equipo interdisciplinario comprometido con relevar, investigar y difundir 
              la labor cultural en Chile, con especial énfasis en lo desarrollado durante el siglo XXI. 
              Nuestro objetivo es visibilizar los aportes culturales que, desde distintas regiones del país, 
              han contribuido a la construcción de identidad, muchas veces al margen de los relatos oficiales 
              de la historia cultural nacional.
            </p>

            <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
              Nuestro equipo está conformado por gestores culturales, artistas, investigadores, periodistas 
              y profesionales de diversas áreas unidos por el interés común de reconocer el trabajo de las 
              comunidades que han aportado al paisaje cultural desde su oficio y vocación.
            </p>
          </div>
        </div>

        {/* Accesos directos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-8">
          {/* Acceso a Proyectos */}
          <a
            href="/proyectos"
            className="group relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden"
          >
            <img 
              src="/img/enlace1.jpeg" 
              alt="Proyectos"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:translate-x-2"
            />
            <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/45 transition-all duration-300 flex items-end justify-start px-5 pb-9 md:px-6 md:pb-10">
              <span className="text-white text-xl sm:text-2xl font-bold text-left leading-none transition-transform duration-500 ease-out group-hover:translate-x-1" style={{fontFamily: 'Aktifo A, sans-serif'}}>
                PROYECTOS
              </span>
            </div>
          </a>

          {/* Acceso a Eventos */}
          <a
            href="/eventos"
            className="group relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden"
          >
            <img 
              src="/img/enlace.jpeg" 
              alt="Eventos"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:translate-x-2"
            />
            <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/45 transition-all duration-300 flex items-end justify-start px-5 pb-9 md:px-6 md:pb-10">
              <span className="text-white text-xl sm:text-2xl font-bold text-left leading-none transition-transform duration-500 ease-out group-hover:translate-x-1" style={{fontFamily: 'Aktifo A, sans-serif'}}>
                EVENTOS
              </span>
            </div>
          </a>
        </div>

      </div>
    </div>
  )
}

export default Presentacion

/**
 * Presentacion.jsx - Página de presentación
 * Página que presenta la fundación, su misión y equipo
 */

import { useState, useEffect } from 'react'

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Carrusel de imágenes - con bordes blancos laterales */}
        <div className="relative w-full overflow-hidden -mt-4 sm:-mt-12 md:-mt-20 h-64 sm:h-80 md:h-[32rem] lg:h-[36rem]">
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

      </div>
    </div>
  )
}

export default Presentacion

/**
 * Presentacion.jsx - Página de presentación
 * Página que presenta la fundación, su misión y equipo
 */

import { useState } from 'react'

function Presentacion() {
  // Estado para el carrusel de imágenes
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Array de imágenes del carrusel
  const carouselImages = [
    '/img/slide1.jpeg',
    '/img/slide2.jpeg',
    '/img/slide3.jpeg'
  ]
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Carrusel de imágenes */}
        <div className="relative w-full h-[400px] md:h-[500px] mb-16 overflow-hidden rounded-lg">
          {/* Imágenes */}
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = ''
                  e.target.parentElement.classList.add('bg-gray-200', 'dark:bg-gray-700')
                  e.target.parentElement.innerHTML += '<div class="absolute inset-0 flex items-center justify-center text-gray-400">Imagen ' + (index + 1) + '</div>'
                }}
              />
            </div>
          ))}
          
          {/* Botón anterior */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          {/* Botón siguiente */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sección principal con logo y descripción */}
        <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start mb-20">
          
          {/* Logo imagen */}
          <div className="flex items-center justify-center rounded-lg overflow-hidden">
            <img 
              src="/img/imagen12.png" 
              alt="Fundación Cultura Local"
              className="w-full h-auto"
            />
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

      </div>
    </div>
  )
}

export default Presentacion

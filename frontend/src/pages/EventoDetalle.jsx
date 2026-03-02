/**
 * EventoDetalle.jsx - Página de detalle del evento
 * Muestra la información completa de un evento
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS, getImageUrl } from '../config/api.config'

function EventoDetalle() {
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvento()
  }, [id])

  const fetchEvento = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.eventoById(id))
      setEvento(response.data)
    } catch (error) {
      console.error('Error al cargar evento:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Evento no encontrado
          </h1>
          <Link to="/eventos" className="text-primary hover:underline">
            Volver a eventos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <Link 
          to="/eventos" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
          Volver a eventos
        </Link>

        {/* Contenido del evento */}
        <article>
          {/* Título */}
          <h1 className="text-5xl font-bold text-primary mb-12 leading-tight">
            {evento.titulo}
          </h1>

          {/* Imagen */}
          {evento.imagen && (
            <div className="relative h-96 bg-white rounded-xl overflow-hidden mb-12 flex items-center justify-center">
              <img 
                src={getImageUrl(evento.imagen)} 
                alt={evento.titulo}
                className="w-full h-full object-contain"
              />
              <span className="absolute top-6 right-6 px-4 py-2 bg-accent text-white text-sm font-bold uppercase tracking-wider rounded-full">
                {evento.categoria}
              </span>
            </div>
          )}

          {/* Información del evento */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Fecha</p>
                <p className="text-gray-900 dark:text-white text-lg font-semibold">
                  {new Date(evento.fecha).toLocaleDateString('es-CL', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Horario</p>
                <p className="text-gray-900 dark:text-white text-lg font-semibold">
                  {evento.horaInicio} {evento.horaFin && `- ${evento.horaFin}`}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Ubicación</p>
                <p className="text-gray-900 dark:text-white text-lg font-semibold">
                  {evento.ubicacion}
                  {evento.direccion && <span className="block text-base font-normal text-gray-600 dark:text-gray-400 mt-1">{evento.direccion}</span>}
                </p>
              </div>
              
              {evento.organizador && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Organiza</p>
                  <p className="text-gray-900 dark:text-white text-lg font-semibold">
                    {evento.organizador}
                  </p>
                </div>
              )}
              
              {evento.cuposMaximos && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Cupos disponibles</p>
                  <p className="text-gray-900 dark:text-white text-lg font-semibold">
                    {evento.cuposMaximos}
                  </p>
                </div>
              )}
              
              {evento.costo !== undefined && evento.costo !== null && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Costo</p>
                  <p className="text-gray-900 dark:text-white text-lg font-semibold">
                    {evento.costo === 0 ? 'Gratuito' : `$${evento.costo.toLocaleString('es-CL')}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Descripción</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {evento.descripcion}
            </p>
          </div>

          {/* Link de inscripción si existe */}
          {evento.linkInscripcion && (
            <div className="text-center mb-12">
              <a 
                href={evento.linkInscripcion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Inscribirse al evento
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default EventoDetalle

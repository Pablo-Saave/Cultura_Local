/**
 * BlogDetalle.jsx - Página de detalle del post
 * Muestra la información completa de un post del blog
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS, getImageUrl } from '../config/api.config'

function BlogDetalle() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.blogById(id))
      setPost(response.data)
    } catch (error) {
      console.error('Error al cargar post:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoriaLabel = (post) => {
    // Verificar si es reciente (últimas 2 semanas)
    const haceDosSemanass = new Date()
    haceDosSemanass.setDate(haceDosSemanass.getDate() - 14) // 2 semanas = 14 días
    const fechaPost = new Date(post.createdAt)
    
    if (fechaPost >= haceDosSemanass) {
      return 'RECIENTE'
    }
    
    // Si no es reciente, mostrar la categoría
    if (post.categoria === 'NOTICIA') return 'NOTICIAS'
    if (post.categoria === 'ENTREVISTA') return 'ENTREVISTAS'
    if (post.categoria === 'ARTICULO') return 'ARTÍCULOS'
    return post.categoria
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

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post no encontrado
          </h1>
          <Link to="/blog" className="text-primary hover:underline">
            Volver al blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Contenido del post */}
        <article>
          {/* Título */}
          <h1 className="text-5xl font-bold text-primary mb-12 leading-tight">
            {post.titulo}
          </h1>

          {/* Imagen Principal */}
          {post.imagen && (
            <div className="relative w-full bg-black overflow-hidden mb-12 flex items-center justify-center aspect-square">
              <img 
                src={getImageUrl(post.imagen)} 
                alt={post.titulo}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Imagen Detalle - Completa sin límites */}
          {post.imagenDetalle && (
            <div className="relative w-full bg-black overflow-auto mb-12 flex items-center justify-center">
              <img 
                src={getImageUrl(post.imagenDetalle)} 
                alt={post.titulo}
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {/* Descripción */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {post.descripcion}
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}

export default BlogDetalle

/**
 * BlogDetalle.jsx - Página de detalle del post
 * Muestra la información completa de un post del blog
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function BlogDetalle() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blog/${id}`)
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
        {/* Botón volver */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
          Volver al blog
        </Link>

        {/* Contenido del post */}
        <article>
          {/* Título */}
          <h1 className="text-5xl font-bold text-primary mb-12 leading-tight">
            {post.titulo}
          </h1>

          {/* Imagen */}
          <div className="relative h-96 bg-white rounded-xl overflow-hidden mb-12 flex items-center justify-center">
            <img 
              src={`http://localhost:5000${post.imagen}`} 
              alt={post.titulo}
              className="w-full h-full object-contain"
            />
            <span className="absolute top-6 right-6 px-4 py-2 bg-accent text-white text-sm font-bold uppercase tracking-wider rounded-full">
              {getCategoriaLabel(post)}
            </span>
          </div>

          {/* Descripción */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {post.descripcion}
            </p>
          </div>

          {/* Fecha al final */}
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm pt-8 border-t border-gray-200 dark:border-gray-700">
            {new Date(post.createdAt).toLocaleDateString('es-CL', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </article>
      </div>
    </div>
  )
}

export default BlogDetalle

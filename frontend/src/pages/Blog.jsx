/**
 * Blog.jsx - Página de blog
 * Muestra los posts del blog
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINTS, getImageUrl } from '../config/api.config'
import SEO from '../components/SEO'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroActivo, setFiltroActivo] = useState('todo')
  const [postsFiltrados, setPostsFiltrados] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filtrarPosts()
  }, [posts, filtroActivo])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.blog)
      setPosts(response.data)
    } catch (error) {
      console.error('Error al cargar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtrarPosts = () => {
    if (filtroActivo === 'todo') {
      setPostsFiltrados(posts)
    } else if (filtroActivo === 'recientes') {
      const haceDosSemanass = new Date()
      haceDosSemanass.setDate(haceDosSemanass.getDate() - 14) // 2 semanas = 14 días
      setPostsFiltrados(posts.filter(post => {
        const fechaPost = new Date(post.createdAt)
        return fechaPost >= haceDosSemanass
      }))
    } else {
      setPostsFiltrados(posts.filter(post => post.categoria === filtroActivo))
    }
  }

  const getCategoriaLabel = (post) => {
    // Priorizar la categoría del post siempre
    if (post.categoria === 'NOTICIA') return 'NOTICIAS'
    if (post.categoria === 'ENTREVISTA') return 'ENTREVISTAS'
    if (post.categoria === 'ARTICULO') return 'ARTÍCULOS'
    
    // Solo mostrar RECIENTE si no tiene categoría y es menor a 2 semanas
    const haceDosSemanass = new Date()
    haceDosSemanass.setDate(haceDosSemanass.getDate() - 14)
    const fechaPost = new Date(post.createdAt)
    
    if (fechaPost >= haceDosSemanass) {
      return 'RECIENTE'
    }
    
    return post.categoria || 'SIN CATEGORÍA'
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

  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <SEO 
        title="Blog"
        description="Descubre artículos, noticias y entrevistas sobre cultura local en Chile. Contenido actualizado sobre prácticas culturales, eventos y proyectos territoriales."
        keywords="blog cultura local, noticias culturales chile, artículos cultura, entrevistas cultura local"
      />
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <h1 className="text-5xl md:text-6xl font-display font-bold text-primary dark:text-primary-light mb-4">
          Blog Cultural
        </h1>
        {/* Subrayado dorado */}
        <div className="w-32 h-1 bg-accent mb-6"></div>
        
        {/* Subtítulo */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
          Lee las últimas noticias, reflexiones y análisis sobre cultura local, 
          patrimonio y participación comunitaria.
        </p>

        {/* Filtros de categorías */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setFiltroActivo('todo')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'todo'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setFiltroActivo('recientes')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'recientes'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Recientes
          </button>
          <button
            onClick={() => setFiltroActivo('NOTICIA')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'NOTICIA'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Noticias
          </button>
          <button
            onClick={() => setFiltroActivo('ARTICULO')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'ARTICULO'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Artículos
          </button>
          <button
            onClick={() => setFiltroActivo('ENTREVISTA')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'ENTREVISTA'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Entrevistas
          </button>
        </div>
        
        {postsFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              No hay publicaciones en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {postsFiltrados.map((post) => (
              <a
                key={post._id} 
                href={`/blog/${post._id}`}
                className="group flex flex-col"
              >
                {/* Contenedor de imagen */}
                <div className="relative aspect-square overflow-hidden">
                  {post.imagen ? (
                    <img 
                      src={getImageUrl(post.imagen)} 
                      alt={post.titulo}
                      className="w-full h-full object-cover image-shift-hover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-xs font-bold text-center px-2">
                        {post.titulo}
                      </span>
                    </div>
                  )}
                  
                  {/* Badge de categoría */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                      {getCategoriaLabel(post)}
                    </span>
                  </div>
                </div>
                
                {/* Título del post */}
                <h3 className="text-sm font-bold text-primary dark:text-primary-light transition-colors mt-3 group-hover:text-gray-900 dark:group-hover:text-white">
                  {post.titulo}
                </h3>
                
                {/* Fecha del post */}
                {post.fecha && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(post.fecha).toLocaleDateString('es-CL', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Instagram */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-display font-bold text-primary dark:text-primary-light mb-4">
          Instagram
        </h2>
        <div className="w-32 h-1 bg-accent mb-6"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 italic">
          Próximamente compartiremos contenido exclusivo sobre nuestras iniciativas.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-shrink-0">
            <img 
              src="/img/imagen12.png" 
              alt="Fundación Cultura Local" 
              className="w-48 h-48 object-contain"
            />
          </div>
          
          <div className="flex-1">
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              Síguenos en Instagram para estar al tanto de nuestras actividades y proyectos culturales.
            </p>
            
            <a 
              href="https://instagram.com/fundacionculturalocal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Síguenos @fundacionculturalocal
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog


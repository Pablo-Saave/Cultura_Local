/**
 * Blog.jsx - Página de blog
 * Muestra los posts del blog
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog')
      setPosts(response.data)
    } catch (error) {
      console.error('Error al cargar posts:', error)
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

  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
<h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light mb-6" style={{fontFamily: 'Aktifo A, sans-serif'}}>
          Blog Cultural
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
          Lee las últimas noticias, reflexiones y análisis sobre cultura local, 
          patrimonio y participación comunitaria.
        </p>
        
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              No hay publicaciones aún
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link 
                key={post._id} 
                to={`/blog/${post._id}`}
                className="bg-white dark:bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer block"
              >
                {/* Imagen */}
                <div className="relative h-64 bg-white dark:bg-white overflow-hidden flex items-center justify-center p-4">
                  {post.imagen && (
                    <img 
                      src={`http://localhost:5000${post.imagen}`} 
                      alt={post.titulo}
                      className="w-full h-full object-contain"
                    />
                  )}
                  <span className="absolute top-4 right-4 px-4 py-1 bg-[#D88A9A] text-white text-xs font-semibold uppercase tracking-wider">
                    {post.categoria === 'NOTICIA' ? 'NOTICIAS' : 'ENTREVISTAS'}
                  </span>
                </div>
                
                {/* Contenido */}
                <div className="p-6 bg-white dark:bg-white">
                  <h3 className="font-bold text-primary text-xl mb-4">
                    {post.titulo}
                  </h3>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('es-CL', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Instagram */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Aktifo A', sans-serif" }}>
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


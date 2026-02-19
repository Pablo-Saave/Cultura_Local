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
    </div>
  )
}

export default Blog


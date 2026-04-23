/**
 * AdminBlog.jsx - Página de administración del blog
 * Permite a editores y admins crear, editar y eliminar posts
 */

import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { API_URL, getImageUrl } from '../config/api.config'

const BLOG_URL = `${API_URL}/api/blog`

function AdminBlog() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'ENTREVISTA',
    imagen: null,
    fecha: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const [imagenDetalle, setImagenDetalle] = useState(null)
  const [imagenDetallePreview, setImagenDetallePreview] = useState('')

  // Cargar posts del backend
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(BLOG_URL)
      setPosts(response.data)
    } catch (error) {
      console.error('Error al cargar posts:', error)
      alert('Error al cargar los posts')
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }))
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageDetalleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagenDetalle(file)
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenDetallePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      formDataToSend.append('titulo', formData.titulo)
      formDataToSend.append('descripcion', formData.descripcion)
      formDataToSend.append('categoria', formData.categoria)
      formDataToSend.append('fecha', formData.fecha)
      
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen)
      }
      
      if (imagenDetalle) {
        formDataToSend.append('imagenDetalle', imagenDetalle)
      }
      
      if (editingPost) {
        // Actualizar post existente
        await axios.put(
          `${BLOG_URL}/${editingPost._id}`,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        alert('Post actualizado correctamente')
      } else {
        // Crear nuevo post
        await axios.post(
          BLOG_URL,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        alert('Post creado correctamente')
      }
      
      // Recargar posts
      await fetchPosts()
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: 'ENTREVISTA',
        fecha: '',
        imagen: null
      })
      setImagePreview('')
      setImagenDetalle(null)
      setImagenDetallePreview('')
      setShowForm(false)
      setEditingPost(null)
    } catch (error) {
      console.error('Error al guardar post:', error)
      alert(error.response?.data?.message || 'Error al guardar el post')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post) => {
    const fechaUTC = new Date(post.fecha)
    const fechaStr = fechaUTC.toISOString().split('T')[0]
    setFormData({
      titulo: post.titulo,
      descripcion: post.descripcion,
      categoria: post.categoria,
      imagen: null,
      fecha: post.fecha ? fechaStr : ''
    })
    setImagePreview(getImageUrl(post.imagen))
    setImagenDetallePreview(post.imagenDetalle ? getImageUrl(post.imagenDetalle) : '')
    setShowForm(true)
    // Hacer scroll al top de la página donde está el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este post?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${BLOG_URL}/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        alert('Post eliminado correctamente')
        await fetchPosts()
      } catch (error) {
        console.error('Error al eliminar post:', error)
        alert('Error al eliminar el post')
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: 'ENTREVISTA',
      imagen: null,
      fecha: ''
    })
    setImagePreview('')
    setImagenDetalle(null)
    setImagenDetallePreview('')
    setShowForm(false)
    setEditingPost(null)
  }

  // Verificar autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/admin/dashboard" 
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver al Dashboard
          </Link>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Administrar Blog
            </h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Nuevo Post
              </button>
            )}
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingPost ? 'Editar Post' : 'Nuevo Post'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Título del post"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="ENTREVISTA">Entrevista</option>
                  <option value="NOTICIA">Noticia</option>
                  <option value="ARTICULO">Artículo</option>
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha del Post
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Contenido del post"
                />
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full max-w-md h-64 object-contain rounded-lg bg-gray-100"
                    />
                  </div>
                )}
              </div>

              {/* Imagen para Página de Detalle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen para Página de Detalle
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageDetalleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {imagenDetallePreview && (
                  <div className="mt-4">
                    <img 
                      src={imagenDetallePreview} 
                      alt="Preview" 
                      className="w-full max-w-md h-64 object-contain rounded-lg bg-gray-100"
                    />
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Guardando...' : (editingPost ? 'Actualizar' : 'Publicar')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No hay posts publicados aún
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-gray-100 rounded-xl overflow-hidden">
                {/* Imagen */}
                <div className="relative bg-white p-4">
                  {post.imagen ? (
                    <img 
                      src={getImageUrl(post.imagen)} 
                      alt={post.titulo}
                      className="w-full h-48 object-contain"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                  <span className="absolute top-6 right-6 px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-full uppercase">
                    {getCategoriaLabel(post)}
                  </span>
                </div>
                
                {/* Contenido */}
                <div className="p-6 bg-white">
                  <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2">
                    {post.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {post.descripcion}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    {new Date(post.createdAt).toLocaleDateString('es-CL', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  
                  {/* Acciones */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminBlog

/**
 * AdminBlog.jsx - Página de administración del blog
 * Permite a editores y admins crear, editar y eliminar posts
 */

import { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { API_URL, getImageUrl } from '../config/api.config'
import AdminLayout from '../components/AdminLayout'
import AdminContentHeader from '../components/AdminContentHeader'

const BLOG_URL = `${API_URL}/api/blog`

function AdminBlog() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
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
      console.error('Error al cargar posts:', error.message)
      alert('Error al cargar los posts')
    }
  }

  const getCategoriaLabel = (post) => {
    // Priorizar la categoría del post siempre
    if (post.categoria === 'NOTICIA') return 'NOTICIAS'
    if (post.categoria === 'ENTREVISTA') return 'ENTREVISTAS'
    if (post.categoria === 'ARTICULO') return 'ARTÍCULOS'
    
    // Solo mostrar RECIENTE si no tiene categoría y la fecha es menor a 2 semanas
    const haceDosSemanass = new Date()
    haceDosSemanass.setDate(haceDosSemanass.getDate() - 14)
    const fechaPost = post.fecha ? new Date(post.fecha) : new Date(post.createdAt)
    
    if (fechaPost >= haceDosSemanass) {
      return 'RECIENTE'
    }
    
    return post.categoria || 'SIN CATEGORÍA'
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
      // Validar que al crear se requiere imagen
      if (!editingId && !formData.imagen) {
        alert('La imagen es requerida para crear un post')
        setLoading(false)
        return
      }
      
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      formDataToSend.append('titulo', formData.titulo)
      formDataToSend.append('descripcion', formData.descripcion)
      formDataToSend.append('categoria', formData.categoria)
      // Enviar fecha sin modificaciones para evitar timezone issues
      formDataToSend.append('fecha', formData.fecha || '')
      
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen)
      }
      
      if (imagenDetalle) {
        formDataToSend.append('imagenDetalle', imagenDetalle)
      }
      
      if (editingId) {
        // Actualizar post existente
        await axios.put(
          `${BLOG_URL}/${editingId}`,
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
      setEditingId(null)
    } catch (error) {
      console.error('Error al guardar post:', error.message)
      alert(error.response?.data?.message || 'Error al guardar el post')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post) => {
    // Usar directamente la fecha sin conversión para evitar timezone issues
    setFormData({
      titulo: post.titulo,
      descripcion: post.descripcion,
      categoria: post.categoria,
      imagen: null,
      fecha: post.fecha ? post.fecha.split('T')[0] : ''
    })
    setImagePreview(getImageUrl(post.imagen))
    setImagenDetallePreview(post.imagenDetalle ? getImageUrl(post.imagenDetalle) : '')
    setShowForm(true)
    setEditingId(post._id) // Usar solo el ID
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
        console.error('Error al eliminar post:', error.message)
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
    setEditingId(null)
  }

  const handleNewPost = () => {
    setEditingId(null)
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
    setShowForm(true)
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
    <AdminLayout>
      <div className="mx-auto max-w-6xl">
        <AdminContentHeader title="Blog" description="Publica historias, entrevistas y noticias de la cultura local." actionLabel={showForm ? 'Cerrar formulario' : 'Nuevo post'} onAction={() => showForm ? handleCancel() : handleNewPost()} />

        {/* Formulario */}
        {showForm && (
          <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10">
            <h2 className="mb-6 text-xl font-bold text-primary-dark">
              {editingId ? 'Editar Post' : 'Nuevo Post'}
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
                  {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Publicar')}
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
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10 sm:p-6">
        <h2 className="mb-5 text-lg font-bold text-primary-dark">Publicaciones <span className="ml-2 text-sm font-medium text-gray-400">{posts.length}</span></h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No hay posts publicados aún
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="overflow-hidden rounded-2xl border border-primary/10 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
                {/* Imagen */}
                <div className="relative bg-primary/5 p-3">
                  {post.imagen ? (
                    <img 
                      src={getImageUrl(post.imagen)} 
                      alt={post.titulo}
                      className="h-48 w-full rounded-xl object-cover"
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
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 text-base font-semibold text-primary-dark">
                    {post.titulo}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                    {post.descripcion}
                  </p>
                  <p className="mb-4 text-xs text-gray-500">
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
                      className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminBlog

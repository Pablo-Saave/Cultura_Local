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
import AdminListFilters, { matchesAdminDate } from '../components/AdminListFilters'

const BLOG_URL = `${API_URL}/api/blog`

function AdminBlog() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
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

  const categorias = [...new Set(posts.map(post => post.categoria).filter(Boolean))].sort()
  const postsFiltrados = posts.filter(post => {
    const texto = `${post.titulo || ''} ${post.descripcion || ''}`.toLocaleLowerCase('es-CL')
    const categoriaOk = categoryFilter === 'all' || post.categoria === categoryFilter
    const estadoOk = statusFilter === 'all' || (statusFilter === 'publicado' && post.estado !== 'borrador') || (statusFilter === 'borrador' && post.estado === 'borrador')
    return texto.includes(search.toLocaleLowerCase('es-CL')) && categoriaOk && estadoOk && matchesAdminDate(post.fecha || post.createdAt, dateRange)
  })

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

        <AdminListFilters
          search={search} onSearchChange={setSearch}
          category={categoryFilter} onCategoryChange={setCategoryFilter} categories={categorias}
          dateRange={dateRange} onDateRangeChange={setDateRange}
          status={statusFilter} onStatusChange={setStatusFilter}
          statuses={[{ value: 'publicado', label: 'Publicados' }, { value: 'borrador', label: 'Borradores' }]}
        />

        {/* Lista de Posts */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10 sm:p-6">
        <h2 className="mb-5 text-lg font-bold text-primary-dark">Publicaciones <span className="ml-2 text-sm font-medium text-gray-400">{postsFiltrados.length}</span></h2>
        <div className="space-y-2">
          {postsFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No hay publicaciones que coincidan con los filtros.
            </div>
          ) : (
            postsFiltrados.map((post) => (
              <div key={post._id} className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3 transition hover:shadow-md sm:grid-cols-[112px_minmax(0,1fr)_170px_120px_auto] sm:gap-4">
                <div className="relative h-24 overflow-hidden rounded-xl bg-primary/5">
                  {post.imagen ? (
                    <img 
                      src={getImageUrl(post.imagen)} 
                      alt={post.titulo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-primary-dark">{post.titulo}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">{post.descripcion}</p>
                </div>
                <div className="border-l border-primary/15 pl-4 text-xs text-primary-dark">
                  <p className="font-medium">{new Date(post.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-primary-dark">{getCategoriaLabel(post)}</span>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${post.estado === 'borrador' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>{post.estado === 'borrador' ? 'Borrador' : 'Publicado'}</span>
                </div>
                <div className="flex gap-2 sm:justify-end">
                    <button
                      onClick={() => handleEdit(post)}
                      className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Eliminar
                    </button>
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

/**
 * AdminProyectos.jsx - Página de administración de proyectos
 * Permite crear, editar y eliminar proyectos
 */

import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const API_URL = 'http://localhost:5000/api/proyectos'

function AdminProyectos() {
  const { user } = useContext(AuthContext)
  const [proyectos, setProyectos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProyecto, setEditingProyecto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'Cartografía',
    autor: '',
    ubicacion: '',
    fechaRealizacion: '',
    linkExterno: '',
    publicado: false,
    destacado: false,
    imagenes: null
  })
  const [imagePreview, setImagePreview] = useState([])

  // Cargar proyectos del backend
  useEffect(() => {
    fetchProyectos()
  }, [])

  const fetchProyectos = async () => {
    try {
      const response = await axios.get(API_URL)
      setProyectos(response.data)
    } catch (error) {
      console.error('Error al cargar proyectos:', error)
      alert('Error al cargar los proyectos')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        imagenes: files
      }))
      
      // Crear previews
      const previews = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          previews.push(reader.result)
          if (previews.length === files.length) {
            setImagePreview(previews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      
      formDataToSend.append('nombre', formData.nombre)
      formDataToSend.append('descripcion', formData.descripcion)
      formDataToSend.append('categoria', formData.categoria)
      formDataToSend.append('autor', formData.autor)
      formDataToSend.append('ubicacion', formData.ubicacion)
      formDataToSend.append('fechaRealizacion', formData.fechaRealizacion)
      formDataToSend.append('linkExterno', formData.linkExterno)
      formDataToSend.append('publicado', formData.publicado)
      formDataToSend.append('destacado', formData.destacado)
      
      if (formData.imagenes) {
        formData.imagenes.forEach(imagen => {
          formDataToSend.append('imagenes', imagen)
        })
      }
      
      if (editingProyecto) {
        // Actualizar proyecto existente
        await axios.put(
          `${API_URL}/${editingProyecto._id}`,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        alert('Proyecto actualizado correctamente')
      } else {
        // Crear nuevo proyecto
        await axios.post(
          API_URL,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        alert('Proyecto creado correctamente')
      }
      
      // Recargar proyectos
      await fetchProyectos()
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: 'Cartografía',
        autor: '',
        ubicacion: '',
        fechaRealizacion: '',
        linkExterno: '',
        publicado: false,
        destacado: false,
        imagenes: null
      })
      setImagePreview([])
      setShowForm(false)
      setEditingProyecto(null)
    } catch (error) {
      console.error('Error al guardar proyecto:', error)
      alert(error.response?.data?.message || 'Error al guardar el proyecto')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (proyecto) => {
    setEditingProyecto(proyecto)
    setFormData({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      categoria: proyecto.categoria,
      autor: proyecto.autor || '',
      ubicacion: proyecto.ubicacion || '',
      fechaRealizacion: proyecto.fechaRealizacion ? proyecto.fechaRealizacion.split('T')[0] : '',
      linkExterno: proyecto.linkExterno || '',
      publicado: proyecto.publicado,
      destacado: proyecto.destacado,
      imagenes: null
    })
    
    if (proyecto.imagenes && proyecto.imagenes.length > 0) {
      setImagePreview(proyecto.imagenes.map(img => `http://localhost:5000${img}`))
    }
    
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_URL}/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        alert('Proyecto eliminado correctamente')
        await fetchProyectos()
      } catch (error) {
        console.error('Error al eliminar proyecto:', error)
        alert('Error al eliminar el proyecto')
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: 'Cartografía',
      autor: '',
      ubicacion: '',
      fechaRealizacion: '',
      linkExterno: '',
      publicado: false,
      destacado: false,
      imagenes: null
    })
    setImagePreview([])
    setShowForm(false)
    setEditingProyecto(null)
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
              Administrar Proyectos
            </h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Nuevo Proyecto
              </button>
            )}
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nombre del proyecto"
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
                  <option value="Cartografía">Cartografía</option>
                  <option value="Fotografía">Fotografía</option>
                  <option value="Arte Visual">Arte Visual</option>
                  <option value="Relatos">Relatos</option>
                  <option value="Patrimonio">Patrimonio</option>
                  <option value="Comunidad">Comunidad</option>
                  <option value="Otro">Otro</option>
                </select>
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
                  placeholder="Descripción del proyecto"
                />
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Autor
                </label>
                <input
                  type="text"
                  name="autor"
                  value={formData.autor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nombre del autor"
                />
              </div>

              {/* Ubicación y Fecha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ubicación del proyecto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Realización
                  </label>
                  <input
                    type="date"
                    name="fechaRealizacion"
                    value={formData.fechaRealizacion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Link Externo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Externo
                </label>
                <input
                  type="url"
                  name="linkExterno"
                  value={formData.linkExterno}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imágenes (hasta 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {imagePreview.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreview.map((preview, index) => (
                      <img 
                        key={index}
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="publicado"
                    checked={formData.publicado}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Publicado</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Destacado</span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Guardando...' : (editingProyecto ? 'Actualizar' : 'Publicar')}
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

        {/* Lista de Proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No hay proyectos publicados aún
            </div>
          ) : (
            proyectos.map((proyecto) => (
              <div key={proyecto._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {/* Imagen */}
                <div className="relative bg-gray-100">
                  {proyecto.imagenPrincipal ? (
                    <img 
                      src={`http://localhost:5000${proyecto.imagenPrincipal}`} 
                      alt={proyecto.nombre}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                </div>
                
                {/* Contenido */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-2">
                    {proyecto.nombre}
                  </h3>
                  
                  {proyecto.fechaRealizacion && (
                    <p className="text-sm text-gray-500 mb-4">
                      <span className="font-semibold">Fecha:</span> {new Date(proyecto.fechaRealizacion).toLocaleDateString('es-CL', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  )}
                  
                  {/* Acciones */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(proyecto)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(proyecto._id)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
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

export default AdminProyectos

/**
 * AdminEventos.jsx - Panel de administración de eventos
 * Interfaz CRUD completa para gestionar eventos
 */

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { API_ENDPOINTS, getImageUrl } from '../config/api.config';

function AdminEventos() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    direccion: '',
    categoria: 'Conversatorio',
    organizador: '',
    inscripcionAbierta: true,
    linkInscripcion: '',
    publicado: false,
    destacado: false
  });
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [imagenDetalle, setImagenDetalle] = useState(null);
  const [imagenDetallePreview, setImagenDetallePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.eventos);
      setEventos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      setError('Error al cargar eventos');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDetalleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenDetalle(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenDetallePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (imagen) {
        formDataToSend.append('imagen', imagen);
      }

      if (imagenDetalle) {
        formDataToSend.append('imagenDetalle', imagenDetalle);
      }

      if (editingId) {
        await axios.put(
          API_ENDPOINTS.eventoById(editingId),
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSuccess('Evento actualizado exitosamente');
      } else {
        await axios.post(
          API_ENDPOINTS.eventos,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSuccess('Evento creado exitosamente');
      }

      resetForm();
      fetchEventos();
    } catch (error) {
      console.error('Error al guardar evento:', error);
      setError(error.response?.data?.message || 'Error al guardar evento');
    }
  };

  const handleEdit = (evento) => {
    // Extraer la fecha en formato UTC para evitar problemas de zona horaria
    const fechaUTC = new Date(evento.fecha);
    const fechaStr = fechaUTC.toISOString().split('T')[0];
    
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: fechaStr,
      ubicacion: evento.ubicacion,
      direccion: evento.direccion || '',
      categoria: evento.categoria,
      organizador: evento.organizador || '',
      inscripcionAbierta: evento.inscripcionAbierta,
      linkInscripcion: evento.linkInscripcion || '',
      publicado: evento.publicado,
      destacado: evento.destacado
    });
    setImagenPreview(evento.imagen ? getImageUrl(evento.imagen) : '');
    setImagenDetallePreview(evento.imagenDetalle ? getImageUrl(evento.imagenDetalle) : '');
    setEditingId(evento._id);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.eventoById(id), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSuccess('Evento eliminado exitosamente');
      fetchEventos();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      setError('Error al eliminar evento');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      direccion: '',
      categoria: 'Conversatorio',
      organizador: '',
      inscripcionAbierta: true,
      linkInscripcion: '',
      pImagenDetalle(null);
    setImagenDetallePreview('');
    setublicado: false,
      destacado: false
    });
    setImagen(null);
    setImagenPreview('');
    setEditingId(null);
    setMostrarFormulario(false);
  };

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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
              Volver al Dashboard
            </Link>
            
            {!mostrarFormulario && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>+</span>
                <span>Nuevo Evento</span>
              </button>
            )}
          </div>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Columna Izquierda - Vista Previa */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista Previa del Evento
                </label>
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  {/* Imagen */}
                  {imagenPreview ? (
                    <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-400 text-sm">Sin imagen</p>
                      </div>
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="p-6">
                    {/* Categoría Badge */}
                    {formData.categoria && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-accent text-gray-900 font-semibold text-xs rounded-full">
                          {formData.categoria.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Título */}
                    <h3 className="text-xl font-bold text-primary mb-2 line-clamp-3">
                      {formData.titulo || 'Título del evento'}
                    </h3>

                    {/* Descripción corta */}
                    {formData.descripcion && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {formData.descripcion}
                      </p>
                    )}

                    {/* Info */}
                    <div className="space-y-2 text-sm text-gray-700">
                      {formData.fecha && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📅</span>
                          <span>{new Date(formData.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })}</span>
                        </div>
                      )}
                      {formData.ubicacion && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📍</span>
                          <span>{formData.ubicacion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Formulario */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                  maxLength="200"
                  placeholder="Ej: Conversatorio sobre arquitectura"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                >
                  <option value="Conversatorio">Conversatorio</option>
                  <option value="Taller">Taller</option>
                  <option value="Exposición">Exposición</option>
                  <option value="Encuentro">Encuentro</option>
                  <option value="Festival">Festival</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Concepción, Chile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Ej: Calle Principal 123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizador
                </label>
                <input
                  type="text"
                  name="organizador"
                  value={formData.organizador}
                  onChange={handleInputChange}
                  placeholder="Ej: Fundación Cultura Local"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link de Inscripción
                </label>
                <input
                  type="url"
                  name="linkInscripcion"
                  value={formData.linkInscripcion}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/inscripcion"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  maxLength="2000"
                  placeholder="Describe detalladamente el evento..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.descripcion.length}/2000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del Evento
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, WebP - Se usa en la lista de eventos</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen para Página de Detalle
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageDetalleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, WebP - Imagen grande sin bordes para la página de detalle</p>
              </div>

              <div className="space-y-2 pt-4">
                <label className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="publicado"
                    checked={formData.publicado}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Publicado (visible en la página)</span>
                </label>

                <label className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Destacado</span>
                </label>

                <label className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inscripcionAbierta"
                    checked={formData.inscripcionAbierta}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Inscripción Abierta</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  {editingId ? 'Actualizar Evento' : 'Crear Evento'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        )}

        {/* Lista de eventos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Eventos Registrados</h2>
          
          {loading ? (
            <p className="text-center text-gray-500 py-8">Cargando eventos...</p>
          ) : eventos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay eventos registrados</p>
          ) : (
            <div className="space-y-4">
              {eventos.map(evento => (
                <div
                  key={evento._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{evento.titulo}</h3>
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                          {evento.categoria}
                        </span>
                        {evento.publicado && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            Publicado
                          </span>
                        )}
                        {evento.destacado && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                            Destacado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(evento.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })} • 
                        {evento.ubicacion}
                      </p>
                      <p className="text-sm text-gray-700">{evento.descripcion}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(evento._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEventos;

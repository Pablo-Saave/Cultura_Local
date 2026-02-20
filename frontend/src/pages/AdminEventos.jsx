/**
 * AdminEventos.jsx - Panel de administración de eventos
 * Interfaz CRUD completa para gestionar eventos
 */

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminEventos() {
  const { token } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
    direccion: '',
    categoria: 'Otro',
    organizador: '',
    cuposMaximos: '',
    inscripcionAbierta: true,
    linkInscripcion: '',
    publicado: false,
    destacado: false
  });
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/eventos');
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

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/eventos/${editingId}`,
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
          'http://localhost:5000/api/eventos',
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
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha.split('T')[0],
      horaInicio: evento.horaInicio,
      horaFin: evento.horaFin || '',
      ubicacion: evento.ubicacion,
      direccion: evento.direccion || '',
      categoria: evento.categoria,
      organizador: evento.organizador || '',
      cuposMaximos: evento.cuposMaximos || '',
      inscripcionAbierta: evento.inscripcionAbierta,
      linkInscripcion: evento.linkInscripcion || '',
      publicado: evento.publicado,
      destacado: evento.destacado
    });
    setImagenPreview(evento.imagen ? `http://localhost:5000${evento.imagen}` : '');
    setEditingId(evento._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/eventos/${id}`, {
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
      horaInicio: '',
      horaFin: '',
      ubicacion: '',
      direccion: '',
      categoria: 'Otro',
      organizador: '',
      cuposMaximos: '',
      inscripcionAbierta: true,
      linkInscripcion: '',
      publicado: false,
      destacado: false
    });
    setImagen(null);
    setImagenPreview('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Eventos
          </h1>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Taller">Taller</option>
                  <option value="Charla">Charla</option>
                  <option value="Exposición">Exposición</option>
                  <option value="Encuentro">Encuentro</option>
                  <option value="Festival">Festival</option>
                  <option value="Otro">Otro</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cupos Máximos
                </label>
                <input
                  type="number"
                  name="cuposMaximos"
                  value={formData.cuposMaximos}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
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
                rows="4"
                maxLength="2000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen del Evento
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {imagenPreview && (
                <div className="mt-2 bg-white p-2 rounded-lg border border-gray-200">
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    className="max-w-md h-auto object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inscripcionAbierta"
                  checked={formData.inscripcionAbierta}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Inscripción Abierta</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="publicado"
                  checked={formData.publicado}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Publicado</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Destacado</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Actualizar Evento' : 'Crear Evento'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
        </div>

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
                        📅 {new Date(evento.fecha).toLocaleDateString('es-CL')} • 
                        🕐 {evento.horaInicio} {evento.horaFin && `- ${evento.horaFin}`} • 
                        📍 {evento.ubicacion}
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

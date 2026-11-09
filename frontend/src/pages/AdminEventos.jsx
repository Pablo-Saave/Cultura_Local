/**
 * AdminEventos.jsx - Panel de administración de eventos
 * Interfaz CRUD completa para gestionar eventos
 */

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { API_ENDPOINTS, getImageUrl } from '../config/api.config';
import AdminLayout from '../components/AdminLayout';
import AdminContentHeader from '../components/AdminContentHeader';
import AdminListFilters, { matchesAdminDate } from '../components/AdminListFilters';

function AdminEventos() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
      console.error('Error al cargar eventos:', error.message);
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
      // Validar que al crear se requiere imagen
      if (!editingId && !imagen) {
        setError('La imagen es requerida para crear un evento');
        return;
      }

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
      console.error('Error al guardar evento:', error.message);
      setError(error.response?.data?.message || 'Error al guardar evento');
    }
  };

  const handleEdit = (evento) => {
    // Usar directamente la fecha sin conversión para evitar timezone issues
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha ? evento.fecha.split('T')[0] : '',
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
      console.error('Error al eliminar evento:', error.message);
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
      publicado: false,
      destacado: false
    });
    setImagen(null);
    setImagenPreview('');
    setImagenDetalle(null);
    setImagenDetallePreview('');
    setEditingId(null);
    setMostrarFormulario(false);
  };

  const categorias = [...new Set(eventos.map(evento => evento.categoria).filter(Boolean))].sort();
  const eventosFiltrados = eventos.filter(evento => {
    const texto = `${evento.titulo || ''} ${evento.descripcion || ''} ${evento.ubicacion || ''}`.toLocaleLowerCase('es-CL');
    const categoriaOk = categoryFilter === 'all' || evento.categoria === categoryFilter;
    const estadoOk = statusFilter === 'all' || (statusFilter === 'publicado' && evento.publicado) || (statusFilter === 'borrador' && !evento.publicado) || (statusFilter === 'destacado' && evento.destacado);
    return texto.includes(search.toLocaleLowerCase('es-CL')) && categoriaOk && estadoOk && matchesAdminDate(evento.fecha, dateRange);
  });

  // Verificar autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
                  </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl">
        <AdminContentHeader title="Eventos" description="Organiza actividades y mantén al día la agenda cultural." actionLabel={mostrarFormulario ? 'Cerrar formulario' : 'Nuevo evento'} onAction={() => mostrarFormulario ? resetForm() : setMostrarFormulario(true)} />

        {/* Formulario */}
        {mostrarFormulario && (
        <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10">
          <h2 className="mb-6 text-xl font-bold text-primary-dark">
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

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
                placeholder="Describe detalladamente el evento..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.descripcion.length}/2000</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
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
                <p className="text-xs text-gray-500 mt-1">Para la lista de eventos</p>
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
                <p className="text-xs text-gray-500 mt-1">Imagen más grande para el detalle</p>
              </div>
            </div>

            <div className="space-y-2">
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
          </form>
        </div>
        )}

        <AdminListFilters
          search={search} onSearchChange={setSearch}
          category={categoryFilter} onCategoryChange={setCategoryFilter} categories={categorias}
          dateRange={dateRange} onDateRangeChange={setDateRange}
          status={statusFilter} onStatusChange={setStatusFilter}
          statuses={[{ value: 'publicado', label: 'Publicados' }, { value: 'borrador', label: 'Borradores' }, { value: 'destacado', label: 'Destacados' }]}
        />

        {/* Lista de eventos */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10 sm:p-6">
          <h2 className="mb-5 text-lg font-bold text-primary-dark">Eventos registrados <span className="ml-2 text-sm font-medium text-gray-400">{eventosFiltrados.length}</span></h2>
          
          {loading ? (
            <p className="text-center text-gray-500 py-8">Cargando eventos...</p>
          ) : eventosFiltrados.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No hay eventos que coincidan con los filtros.</p>
          ) : (
            <div className="space-y-2">
              {eventosFiltrados.map(evento => (
                <div
                  key={evento._id}
                  className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3 transition hover:shadow-md sm:grid-cols-[112px_minmax(0,1fr)_170px_120px_auto] sm:gap-4"
                >
                  <div className="h-24 overflow-hidden rounded-xl bg-primary/5">
                    {evento.imagen ? <img src={getImageUrl(evento.imagen)} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-gray-400">Sin imagen</div>}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-primary-dark">{evento.titulo}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600">{evento.descripcion}</p>
                  </div>
                  <div className="border-l border-primary/15 pl-4 text-xs text-primary-dark">
                    <p className="font-medium">{new Date(evento.fecha).toLocaleDateString('es-CL', { timeZone: 'UTC' })}</p>
                    <p className="mt-1 truncate text-gray-500">{evento.ubicacion}</p>
                    <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-primary-dark">{evento.categoria}</span>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${evento.publicado ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{evento.publicado ? 'Publicado' : 'Borrador'}</span>
                    {evento.destacado && <span className="ml-1 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">★</span>}
                  </div>
                  <div className="flex gap-2 sm:justify-end">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(evento._id)}
                        className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminEventos;

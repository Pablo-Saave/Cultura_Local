/**
 * AdminProyectos.jsx - Administración de Proyectos
 * Panel para crear, editar y eliminar proyectos
 */

import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../config/api.config';
import AdminLayout from '../components/AdminLayout';
import AdminContentHeader from '../components/AdminContentHeader';
import AdminListFilters, { matchesAdminDate } from '../components/AdminListFilters';

const CATEGORIAS_PROYECTO = ['Fotografía', 'Arte Visual', 'Patrimonio', 'Otro'];
const FILTROS_PROYECTO = [
  ...CATEGORIAS_PROYECTO.map(value => ({ value, label: value })),
  { value: '__destacado', label: 'Destacados' },
  { value: '__reciente', label: 'Recientes' },
  { value: '__educativo', label: 'Educativos' },
];

function AdminProyectos() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    fechaRealizacion: '',
    linkExterno: '',
    destacado: false,
    educativo: false
  });
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (user) {
      fetchProyectos();
    }
  }, [user]);

  const fetchProyectos = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.proyectos);
      setProyectos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar proyectos:', error.message);
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
    const files = Array.from(e.target.files).slice(0, 5);
    setImagenes(files);

    // Crear previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    imagenes.forEach(imagen => {
      data.append('imagenes', imagen);
    });

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      if (editando) {
        await axios.put(API_ENDPOINTS.proyectoById(editando), data, config);
        alert('Proyecto actualizado exitosamente');
      } else {
        await axios.post(API_ENDPOINTS.proyectos, data, config);
        alert('Proyecto creado exitosamente');
      }

      resetForm();
      fetchProyectos();
    } catch (error) {
      console.error('Error al guardar proyecto:', error.message);
      alert('Error al guardar el proyecto');
    }
  };

  const handleEdit = (proyecto) => {
    setEditando(proyecto._id);
    setFormData({
      nombre: proyecto.nombre,
      categoria: proyecto.categoria || '',
      fechaRealizacion: proyecto.fechaRealizacion ? proyecto.fechaRealizacion.split('T')[0] : '',
      linkExterno: proyecto.linkExterno || '',
      destacado: proyecto.destacado || false,
      educativo: proyecto.educativo || false
    });
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_ENDPOINTS.proyectoById(id), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Proyecto eliminado exitosamente');
      fetchProyectos();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error.message);
      alert('Error al eliminar el proyecto');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: '',
      fechaRealizacion: '',
      linkExterno: '',
      destacado: false,
      educativo: false
    });
    setImagenes([]);
    setPreviews([]);
    setEditando(null);
    setMostrarFormulario(false);
  };

  const categorias = FILTROS_PROYECTO;
  const proyectosFiltrados = proyectos.filter(proyecto => {
    const texto = `${proyecto.nombre || ''} ${proyecto.descripcion || ''}`.toLocaleLowerCase('es-CL');
    const fechaReciente = proyecto.fechaRealizacion && new Date(proyecto.fechaRealizacion) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const categoriaOk = categoryFilter === 'all'
      || proyecto.categoria === categoryFilter
      || (categoryFilter === '__destacado' && proyecto.destacado)
      || (categoryFilter === '__educativo' && proyecto.educativo)
      || (categoryFilter === '__reciente' && fechaReciente);
    return texto.includes(search.toLocaleLowerCase('es-CL')) && categoriaOk && matchesAdminDate(proyecto.fechaRealizacion, dateRange);
  });

  const getProyectoBadges = (proyecto) => {
    const badges = [];
    if (proyecto.destacado) badges.push('Destacado');
    if (proyecto.educativo) badges.push('Educativo');
    if (!badges.length && proyecto.fechaRealizacion && new Date(proyecto.fechaRealizacion) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) badges.push('Reciente');
    return badges;
  };

  if (!authLoading && !user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl">
        <AdminContentHeader title="Proyectos" description="Gestiona tus proyectos y mantén el contenido actualizado." actionLabel={mostrarFormulario ? 'Cerrar formulario' : 'Nuevo proyecto'} onAction={() => mostrarFormulario ? resetForm() : setMostrarFormulario(true)} />
        {mostrarFormulario && (
          <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary/10">
            <h2 className="mb-6 text-xl font-bold text-primary-dark">
              {editando ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Categoría y distinciones
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIAS_PROYECTO.map(opcion => <option key={opcion} value={opcion}>{opcion}</option>)}
                </select>
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Distinciones del proyecto">
                  {[['destacado', 'Destacado'], ['educativo', 'Educativo']].map(([name, label]) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={formData[name]}
                      onClick={() => setFormData(prev => ({ ...prev, [name]: !prev[name] }))}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${formData[name] ? 'border-primary bg-primary text-white' : 'border-primary/20 bg-white text-primary-dark hover:bg-primary/5'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Externo
                </label>
                <input
                  type="url"
                  name="linkExterno"
                  value={formData.linkExterno}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes (máximo 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {previews.map((preview, idx) => (
                    <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editando ? 'Actualizar' : 'Crear'} Proyecto
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
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
          categoryPlaceholder="Todos los proyectos"
        />

        {/* Lista de Proyectos */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary/10 sm:p-6">
          <h2 className="mb-5 text-lg font-bold text-primary-dark">Gestión de proyectos <span className="ml-2 text-sm font-medium text-gray-400">{proyectosFiltrados.length}</span></h2>
          
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">Cargando proyectos…</p>
          ) : proyectosFiltrados.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No hay proyectos que coincidan con los filtros.</p>
          ) : (
            <div className="space-y-2">
              {proyectosFiltrados.map((proyecto) => {
                const badges = getProyectoBadges(proyecto);
                
                return (
                  <div key={proyecto._id} className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3 transition hover:shadow-md sm:grid-cols-[112px_minmax(0,1fr)_150px_minmax(240px,auto)] sm:gap-4">
                    <div className="h-24 overflow-hidden rounded-xl bg-primary/5">
                      {proyecto.imagenPrincipal ? (
                        <img 
                          src={getImageUrl(proyecto.imagenPrincipal)} 
                          alt={proyecto.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                      
                    </div>
                    
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-primary-dark">{proyecto.nombre}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">{proyecto.descripcion || 'Proyecto de Cultura Local.'}</p>
                    </div>
                    <div className="border-l border-primary/15 pl-4 text-xs text-primary-dark">
                      <p className="font-medium">{proyecto.fechaRealizacion ? new Date(proyecto.fechaRealizacion).toLocaleDateString('es-CL') : 'Fecha por definir'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {proyecto.categoria && proyecto.categoria !== 'Otro' && <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary-dark">{proyecto.categoria}</span>}
                        {badges.map(badge => <span key={badge} className="rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary-dark">{badge}</span>)}
                        <button
                          onClick={() => handleEdit(proyecto)}
                          className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(proyecto._id)}
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProyectos;

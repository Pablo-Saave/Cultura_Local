/**
 * AdminProyectos.jsx - Administración de Proyectos
 * Panel para crear, editar y eliminar proyectos
 */

import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function AdminProyectos() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    fechaRealizacion: '',
    ubicacion: '',
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
      const response = await axios.get('http://localhost:5000/api/proyectos');
      setProyectos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
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
        await axios.put(`http://localhost:5000/api/proyectos/${editando}`, data, config);
        alert('Proyecto actualizado exitosamente');
      } else {
        await axios.post('http://localhost:5000/api/proyectos', data, config);
        alert('Proyecto creado exitosamente');
      }

      resetForm();
      fetchProyectos();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      alert('Error al guardar el proyecto');
    }
  };

  const handleEdit = (proyecto) => {
    setEditando(proyecto._id);
    setFormData({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      categoria: proyecto.categoria || '',
      fechaRealizacion: proyecto.fechaRealizacion ? proyecto.fechaRealizacion.split('T')[0] : '',
      ubicacion: proyecto.ubicacion || '',
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
      await axios.delete(`http://localhost:5000/api/proyectos/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Proyecto eliminado exitosamente');
      fetchProyectos();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      fechaRealizacion: '',
      ubicacion: '',
      linkExterno: '',
      destacado: false,
      educativo: false
    });
    setImagenes([]);
    setPreviews([]);
    setEditando(null);
    setMostrarFormulario(false);
  };

  const getCategoriaLabel = (proyecto) => {
    if (proyecto.destacado) return { label: 'DESTACADO', color: 'bg-accent' };
    if (proyecto.educativo) return { label: 'EDUCATIVO', color: 'bg-accent' };
    
    if (proyecto.fechaRealizacion) {
      const fechaProyecto = new Date(proyecto.fechaRealizacion);
      const haceUnMes = new Date();
      haceUnMes.setMonth(haceUnMes.getMonth() - 1);
      if (fechaProyecto >= haceUnMes) {
        return { label: 'RECIENTE', color: 'bg-accent' };
      }
    }
    return null;
  };

  if (authLoading || loading) {
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin/dashboard"
                className="text-primary hover:text-primary-dark flex items-center gap-2"
              >
                <span>←</span>
                <span>Volver al Dashboard</span>
              </Link>
            </div>
            {!mostrarFormulario && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg transition-colors font-semibold"
              >
                + Nuevo Proyecto
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mostrarFormulario && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editando ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

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

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Destacado</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="educativo"
                  checked={formData.educativo}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Educativo</span>
              </label>
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

        {/* Lista de Proyectos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Gestión de Proyectos</h2>
          
          {proyectos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay proyectos registrados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyectos.map((proyecto) => {
                const categoria = getCategoriaLabel(proyecto);
                
                return (
                  <div key={proyecto._id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-video bg-gray-100">
                      {proyecto.imagenPrincipal ? (
                        <img 
                          src={`http://localhost:5000${proyecto.imagenPrincipal}`} 
                          alt={proyecto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                      
                      {categoria && (
                        <div className="absolute top-2 right-2">
                          <span className={`${categoria.color} text-white text-xs font-bold px-4 py-1.5 rounded-full`}>
                            {categoria.label}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{proyecto.nombre}</h3>
                      {proyecto.fechaRealizacion && (
                        <p className="text-sm text-gray-500 mb-3">
                          {new Date(proyecto.fechaRealizacion).toLocaleDateString('es-CL')}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(proyecto)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(proyecto._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminProyectos;

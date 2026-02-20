/**
 * Publicaciones.jsx - Página de proyectos
 * Página que muestra los proyectos de la fundación
 */
import { useState, useEffect } from 'react';
import axios from 'axios';

function Publicaciones() {
  const [proyectos, setProyectos] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('todo');
  const [proyectosFiltrados, setProyectosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProyectos();
  }, []);

  useEffect(() => {
    filtrarProyectos();
  }, [proyectos, filtroActivo]);

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

  const filtrarProyectos = () => {
    let filtrados = [...proyectos];

    if (filtroActivo === 'destacado') {
      filtrados = filtrados.filter(p => p.destacado);
    } else if (filtroActivo === 'educativo') {
      filtrados = filtrados.filter(p => p.educativo);
    } else if (filtroActivo === 'recientes') {
      const haceUnMes = new Date();
      haceUnMes.setMonth(haceUnMes.getMonth() - 1);
      filtrados = filtrados.filter(p => {
        if (p.fechaRealizacion) {
          const fechaProyecto = new Date(p.fechaRealizacion);
          return fechaProyecto >= haceUnMes;
        }
        return false;
      });
    }

    setProyectosFiltrados(filtrados);
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

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <h1 className="text-5xl md:text-6xl font-bold text-primary dark:text-primary-light mb-4" style={{fontFamily: 'Aktifo A, sans-serif'}}>
          Proyectos
        </h1>
        {/* Subrayado dorado */}
        <div className="w-32 h-1 bg-accent mb-6"></div>
        
        {/* Subtítulo */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-4xl">
          Explora las iniciativas que estamos impulsando para transformar nuestro entorno a través del arte, la educación y la cultura local.
        </p>

        {/* Filtros de categorías */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setFiltroActivo('todo')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'todo'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setFiltroActivo('destacado')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'destacado'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Destacado
          </button>
          <button
            onClick={() => setFiltroActivo('recientes')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'recientes'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Recientes
          </button>
          <button
            onClick={() => setFiltroActivo('educativo')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
              filtroActivo === 'educativo'
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            Educativos
          </button>
        </div>

        {/* Grid de proyectos */}
        {proyectosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              No hay proyectos en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectosFiltrados.map((proyecto) => {
              const categoria = getCategoriaLabel(proyecto);
              
              return (
                <a
                  key={proyecto._id}
                  href={proyecto.linkExterno || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-white dark:bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
                    {/* Imagen del proyecto con badge */}
                    <div className="relative aspect-square bg-white dark:bg-white flex items-center justify-center p-8">
                      {proyecto.imagenPrincipal ? (
                        <img 
                          src={`http://localhost:5000${proyecto.imagenPrincipal}`} 
                          alt={proyecto.nombre}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-4xl font-bold text-center">
                          {proyecto.nombre}
                        </div>
                      )}
                      
                      {/* Badge de categoría */}
                      {categoria && (
                        <div className="absolute top-4 right-4">
                          <span className={`${categoria.color} text-white text-xs font-bold px-4 py-1.5 rounded-full`}>
                            {categoria.label}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Información del proyecto */}
                    <div className="p-6 flex-grow flex items-center justify-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-900 text-center group-hover:text-primary transition-colors">
                        {proyecto.nombre}
                      </h3>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Sección de Instagram */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-primary dark:text-primary-light mb-4" style={{fontFamily: 'Aktifo A, sans-serif'}}>
            Instagram
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 dark:bg-dark-bg rounded-xl p-8">
            {/* Logo de la fundación */}
            <div className="w-48 h-48 flex-shrink-0">
              <img 
                src="/img/imagen12.png" 
                alt="Fundación Cultura Local"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Contenido */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                Síguenos en Instagram para estar al tanto de nuestras actividades y proyectos culturales.
              </p>
              <p className="text-gray-600 dark:text-gray-400 italic mb-6">
                Próximamente compartiremos contenido exclusivo sobre nuestras iniciativas.
              </p>
              <a
                href="https://www.instagram.com/fundacionculturalocal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Síguenos @fundacionculturalocal
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Publicaciones

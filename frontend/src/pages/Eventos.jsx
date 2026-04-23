/**
 * Eventos.jsx - Pagina de eventos
 * Pagina que lista eventos con diseño de cards, filtros y calendario.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../config/api.config';
import SEO from '../components/SEO';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filtroActivo, setFiltroActivo] = useState('todo');

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.eventos);
      setEventos(response.data.filter(e => e.publicado));
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      setLoading(false);
    }
  };

  const months = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const hasEventsOnDate = (day) => {
    return eventos.some(evento => {
      const eventoDate = new Date(evento.fecha);
      return eventoDate.getUTCDate() === day &&
             eventoDate.getUTCMonth() === currentMonth &&
             eventoDate.getUTCFullYear() === currentYear;
    });
  };

  const getEventsForDate = (day) => {
    return eventos.filter(evento => {
      const eventoDate = new Date(evento.fecha);
      return eventoDate.getUTCDate() === day &&
             eventoDate.getUTCMonth() === currentMonth &&
             eventoDate.getUTCFullYear() === currentYear;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvents = hasEventsOnDate(day);
      const isToday = isCurrentMonth && today.getDate() === day;
      const isSelected = selectedDate === day;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`h-12 flex items-center justify-center text-sm font-medium transition-all relative
            ${isToday ? 'ring-2 ring-primary rounded-full' : ''}
            ${isSelected ? 'bg-accent text-gray-900 rounded-full' : 'hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'}
            ${hasEvents && !isSelected ? 'text-accent font-bold' : 'text-gray-900 dark:text-gray-100'}
          `}
        >
          {day}
          {hasEvents && !isSelected && (
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></span>
          )}
        </button>
      );
    }

    return days;
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  
  // Filtrar eventos según categoría activa
  const eventosFiltrados = eventos.filter(evento => {
    if (!evento.publicado) return false;
    
    if (filtroActivo === 'todo') return true;
    
    if (filtroActivo === 'recientes') {
      const haceDosSemanass = new Date();
      haceDosSemanass.setDate(haceDosSemanass.getDate() - 14); // 2 semanas = 14 días
      const fechaEvento = new Date(evento.fecha);
      return fechaEvento >= haceDosSemanass;
    }
    
    return evento.categoria.toLowerCase() === filtroActivo.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <SEO 
        title="Eventos"
        description="Descubre los eventos culturales de Fundación Cultura Local. Talleres, charlas, encuentros y actividades territoriales en Chile."
        keywords="eventos cultura local, eventos culturales chile, talleres cultura, actividades culturales, encuentros territoriales"
      />
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <h1 className="text-5xl md:text-6xl font-display font-bold text-primary dark:text-primary-light mb-4">
          Nuestros Eventos
        </h1>
        {/* Subrayado dorado */}
        <div className="w-32 h-1 bg-accent mb-6"></div>
        
        {/* Subtítulo */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl">
          Descubre los próximos encuentros culturales, talleres y actividades comunitarias 
          que organizamos para fortalecer nuestra identidad local.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sección principal con filtros y eventos */}
          <div className="flex-1">
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
                onClick={() => setFiltroActivo('taller')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  filtroActivo === 'taller'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                Taller
              </button>
              <button
                onClick={() => setFiltroActivo('conversatorio')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  filtroActivo === 'conversatorio'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                Conversatorio
              </button>
              <button
                onClick={() => setFiltroActivo('exposición')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  filtroActivo === 'exposición'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                Exposición
              </button>
              <button
                onClick={() => setFiltroActivo('festival')}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  filtroActivo === 'festival'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                Festival
              </button>
            </div>

            {/* Grid de eventos */}
            {eventosFiltrados.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">
                  No hay eventos en esta categoría
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventosFiltrados.map((evento) => (
                  <a
                    key={evento._id}
                    href={`/eventos/${evento._id}`}
                    className="group flex flex-col"
                  >
                    {/* Contenedor de imagen */}
                    <div className="relative aspect-square overflow-hidden">
                      {evento.imagen ? (
                        <img 
                          src={getImageUrl(evento.imagen)} 
                          alt={evento.titulo}
                          className="w-full h-full object-cover image-shift-hover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-bold text-center px-2">
                            {evento.titulo}
                          </span>
                        </div>
                      )}
                      
                      {/* Badge de categoría */}
                      <div className="absolute top-2 right-2">
                        <span className="bg-accent text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                          {evento.categoria.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Título del evento */}
                    <h3 className="text-sm font-bold text-primary dark:text-primary-light transition-colors mt-3 group-hover:text-gray-900 dark:group-hover:text-white">
                      {evento.titulo}
                    </h3>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Calendario */}
          <div className="w-full lg:w-96">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Mes anterior"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Aktifo A', sans-serif" }}>
                  {months[currentMonth]}
                </h3>
                
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Mes siguiente"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full mr-1"></span>
                  Días con eventos programados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Eventos


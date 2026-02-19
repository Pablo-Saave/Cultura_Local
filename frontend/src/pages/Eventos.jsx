/**
 * Eventos.jsx - Pagina de eventos
 * Pagina que lista eventos proximos y pasados, consume endpoint /eventos del backend.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/eventos');
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
      return eventoDate.getDate() === day &&
             eventoDate.getMonth() === currentMonth &&
             eventoDate.getFullYear() === currentYear;
    });
  };

  const getEventsForDate = (day) => {
    return eventos.filter(evento => {
      const eventoDate = new Date(evento.fecha);
      return eventoDate.getDate() === day &&
             eventoDate.getMonth() === currentMonth &&
             eventoDate.getFullYear() === currentYear;
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
            ${isSelected ? 'bg-accent text-white rounded-full' : 'hover:bg-gray-100 rounded-full'}
            ${hasEvents && !isSelected ? 'text-accent font-bold' : 'text-gray-900'}
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
  const upcomingEvents = eventos
    .filter(e => new Date(e.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, 3);

  return (
    <div className="min-h-screen py-20 px-4 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-light mb-6" style={{fontFamily: 'Aktifo A, sans-serif'}}>
          Nuestros Eventos
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
          Descubre los próximos encuentros culturales, talleres y actividades comunitarias 
          que organizamos para fortalecer nuestra identidad local.
        </p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de eventos */}
          <div className="flex-1">
            {loading ? (
              <p className="text-center text-gray-500 py-20">Cargando eventos...</p>
            ) : selectedDate ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-primary hover:text-primary/80 font-semibold"
                  >
                    ← Volver
                  </button>
                  <h2 className="text-2xl font-bold text-primary">
                    {selectedDate} de {months[currentMonth]} {currentYear}
                  </h2>
                </div>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-center text-gray-500 py-20">
                    No hay eventos para esta fecha
                  </p>
                ) : (
                  <div className="space-y-6">
                    {selectedDateEvents.map(evento => (
                      <div key={evento._id} className="bg-white dark:bg-white rounded-lg shadow-lg overflow-hidden">
                        {evento.imagen && (
                          <img
                            src={`http://localhost:5000${evento.imagen}`}
                            alt={evento.titulo}
                            className="w-full h-64 object-contain bg-white p-4"
                          />
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
                              {evento.categoria}
                            </span>
                            {evento.destacado && (
                              <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-semibold">
                                Destacado
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-primary mb-3">{evento.titulo}</h3>
                          <div className="space-y-2 text-gray-600 dark:text-gray-600 mb-4">
                            <p>📅 {new Date(evento.fecha).toLocaleDateString('es-CL', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}</p>
                            <p>🕐 {evento.horaInicio} {evento.horaFin && `- ${evento.horaFin}`}</p>
                            <p>📍 {evento.ubicacion} {evento.direccion && `- ${evento.direccion}`}</p>
                            {evento.organizador && <p>👥 Organiza: {evento.organizador}</p>}
                          </div>
                          <p className="text-gray-700 dark:text-gray-700 whitespace-pre-line mb-4">
                            {evento.descripcion}
                          </p>
                          {evento.cuposMaximos && (
                            <p className="text-sm text-gray-600 dark:text-gray-600 mb-4">
                              📊 Cupos disponibles: {evento.cuposMaximos}
                            </p>
                          )}
                          {evento.inscripcionAbierta && evento.linkInscripcion && (
                            <a
                              href={evento.linkInscripcion}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Inscribirse al evento
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">Próximos Eventos</h2>
                {upcomingEvents.length === 0 ? (
                  <p className="text-center text-gray-500 py-20">
                    No hay eventos próximos programados
                  </p>
                ) : (
                  <div className="space-y-6">
                    {upcomingEvents.map(evento => (
                      <div key={evento._id} className="bg-white dark:bg-white rounded-lg shadow-lg overflow-hidden">
                        {evento.imagen && (
                          <img
                            src={`http://localhost:5000${evento.imagen}`}
                            alt={evento.titulo}
                            className="w-full h-64 object-contain bg-white p-4"
                          />
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
                              {evento.categoria}
                            </span>
                            {evento.destacado && (
                              <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-semibold">
                                Destacado
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-primary mb-3">{evento.titulo}</h3>
                          <div className="space-y-2 text-gray-600 dark:text-gray-600 mb-4">
                            <p>📅 {new Date(evento.fecha).toLocaleDateString('es-CL', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}</p>
                            <p>🕐 {evento.horaInicio} {evento.horaFin && `- ${evento.horaFin}`}</p>
                            <p>📍 {evento.ubicacion}</p>
                          </div>
                          <p className="text-gray-700 dark:text-gray-700 mb-4">
                            {evento.descripcion.length > 200 
                              ? `${evento.descripcion.substring(0, 200)}...` 
                              : evento.descripcion}
                          </p>
                          {evento.inscripcionAbierta && evento.linkInscripcion && (
                            <a
                              href={evento.linkInscripcion}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Más información
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calendario */}
          <div className="lg:w-96">
            <div className="bg-white dark:bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Mes anterior"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Aktifo A', sans-serif" }}>
                  {months[currentMonth]}
                </h3>
                
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Mes siguiente"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
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


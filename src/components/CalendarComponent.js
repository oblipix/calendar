import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarComponent.css'; // CSS do calendário
import { FaCheck, FaTrash, FaTimes, FaTimesCircle } from 'react-icons/fa'; // Adicione FaTimesCircle para o estilo X
import './EventModal.js'; // Importa o componente do modal

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [showEventList, setShowEventList] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Carregar eventos do localStorage quando o componente é montado
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(savedEvents);
  }, []);

  // Salvar eventos no localStorage sempre que o estado de eventos muda
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowOptions(true);
    setShowAddModal(false);
    setShowEventList(false);
  };

  const handleAddEvent = () => {
    if (newEvent.trim() === "") return;
    const dateStr = selectedDate.toISOString().split("T")[0];
    const newEventObject = {
      id: new Date().getTime(),
      date: dateStr,
      description: newEvent,
      completed: false,
    };
    const updatedEvents = [...events, newEventObject];
    setEvents(updatedEvents);
    setNewEvent("");
    setShowAddModal(false);
    setShowOptions(false);
  };

  const handleViewEvents = () => {
    setShowEventList(true);
    setShowAddModal(false);
    setShowOptions(false);
  };

  const handleCompleteEvent = (id) => {
    const updatedEvents = events.map(event =>
      event.id === id
        ? { ...event, completed: !event.completed }
        : event
    );
    setEvents(updatedEvents);
  };

  const handleDeleteEvent = (id) => {
    setEventToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const updatedEvents = events.filter(event => event.id !== eventToDelete);
    setEvents(updatedEvents);
    setShowDeleteModal(false);
    setShowEventList(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="calendar-container">
      <h1>Calendário</h1 >
      <Calendar
        className="custom-calendar"
        onClickDay={handleDateClick}
        value={selectedDate || new Date()}
        tileContent={({ date }) => {
          const dateStr = date.toISOString().split("T")[0];
          const hasEvent = events.some(event => event.date === dateStr);
          return (
            <div className="event-indicator">
              {hasEvent && (
                <span>•</span>
              )}
            </div>
          );
        }}
      />
      {showOptions && selectedDate && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="icon-button close-button" onClick={() => setShowOptions(false)}>
              <FaTimes />
            </button>
            <h2>Escolha uma opção</h2>
            <button className="icon-button2" onClick={() => setShowAddModal(true)}>
              Adicionar Evento
            </button>
            <button className="icon-button2" onClick={handleViewEvents}>
              Visualizar Eventos
            </button>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="icon-button close-button" onClick={() => setShowAddModal(false)}>
              <FaTimes />
            </button>
            <h2>Adicionar Evento</h2>
            <input
              type="text" class="text-input"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Digite o evento"
            />
            <button className="icon-button2" onClick={handleAddEvent}>
              Adicionar
            </button>
          </div>
        </div>
      )}
      {showEventList && selectedDate && (
        <div className="event-list show">
          <button className="icon-button close-button" onClick={() => setShowEventList(false)}>
            <FaTimes />
          </button>
          <h3>Eventos do Dia</h3>
          {events.filter(event => event.date === selectedDate.toISOString().split("T")[0]).map(event => (
            <div key={event.id} className={`event-item ${event.completed ? 'event-completed' : ''}`}>
              <span>{event.description}</span>
              <div className="event-controls">
                <button 
                  className={`icon-button unmark-event-button ${event.completed ? 'completed' : ''}`}
                  onClick={() => handleCompleteEvent(event.id)}
                >
                  {event.completed ? <FaTimesCircle /> : <FaCheck />} {/* Substitua FaEye por FaTimesCircle e FaCheck */}
                </button>
                <button className="icon-button delete-button" onClick={() => handleDeleteEvent(event.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="icon-button close-button" onClick={handleCancelDelete}>
              <FaTimes />
            </button>
            <p>Tem certeza que deseja excluir este evento?</p>
            <div className="icon-button-container">
              <button className="icon-button2" onClick={handleConfirmDelete}>Confirmar</button>
              <button className="icon-button2" onClick={handleCancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;

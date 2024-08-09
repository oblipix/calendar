import React from 'react';
import './EventModal.css'; // CSS específico para o modal

const EventModal = ({ isOpen, onClose, event, onDelete, onComplete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>X</button>
        <h2>{event ? event.title : 'Sem Evento'}</h2>
        <p>{event ? event.description : 'Nenhuma descrição disponível.'}</p>
        <button onClick={() => onComplete(event.id)}>Marcar como Concluído</button>
        <button onClick={() => onDelete(event.id)}>Excluir Evento</button>
      </div>
    </div>
  );
};

export default EventModal;

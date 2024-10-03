import React from 'react';
import { Link } from 'react-router-dom'; 
import './SuccessMessage.css';

const SuccessMessage = ({ ticket }) => {
  console.log('Ticket:', ticket);

  const ticketImage = ticket.image || '';

  return (
    <div className="success-message">
      <div className="tick-icon">&#10003;</div>
      <h2>Your Ticket is Live Now!</h2>
      <div className="ticket-details">
        {ticketImage && (
          <img src={ticketImage} alt={ticket.title || 'Ticket Image'} className="ticket-image" />
        )}
        <div className="ticket-info">
          <p><strong>Title:</strong> {ticket.title || 'N/A'}</p>
          <p><strong>Description:</strong> {ticket.description || 'N/A'}</p>
          <p><strong>Price:</strong> ${ticket.price || 'N/A'}</p>
          <p><strong>Availability:</strong> {ticket.availability || 'N/A'}</p>
          <p><strong>Location:</strong> {ticket.location || 'N/A'}</p>
        </div>
        <Link to="/Live" className="live-now-button" state={ticket}>
          View Your Tickets
        </Link>
      </div>
    </div>
  );
};

export default SuccessMessage;

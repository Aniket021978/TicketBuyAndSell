import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Live.css';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const fetchUserTickets = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tickets/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket) => {
    if (ticket.title === 'Movie') {
      navigate(`/MovieTicket`, { state: { ticket } });
    } else if (ticket.title === 'Concert') {
      navigate(`/ConcertTicket`, { state: { ticket } });
    } else if (ticket.title === 'Sports') {
      navigate(`/SportsTicket`, { state: { ticket } });
    }
  };

  const handleDeleteClick = (ticket) => {
    setTicketToDelete(ticket);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (ticketToDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tickets/${ticketToDelete._id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete ticket');
        }
        setTickets(tickets.filter(ticket => ticket._id !== ticketToDelete._id));
        setIsModalOpen(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserTickets();
    } else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="live-page">
      <h2 className="live-title">Your Tickets</h2>
      <Link to="/" className="home-button">Home</Link>
      <div className="ticket-list">
        {tickets.length === 0 ? (
          <p className="no-tickets-message">You Have Not Yet Sell Any Ticket.</p>
        ) : (
          tickets.map(ticket => (
            <div key={ticket._id} className="ticket-card">
              <img src={ticket.image} alt={ticket.title} className="ticket-image" />
              <div className="ticket-info">
                <h3 className="ticket-title">{ticket.title}</h3>
                <p><strong>Description:</strong> {ticket.description}</p>
                <p><strong>Price:</strong> ₹{ticket.price}</p>
                <p><strong>Availability:</strong> {ticket.availability}</p>
                <p><strong>Location:</strong> {ticket.location}</p>
                <p className={`status ${ticket.status}`}>
                  {ticket.status === "expired" ? "Expired" : "Active"}
                  {ticket.status === "active" && <span className="green-light"></span>}
                  {ticket.status === "expired" && <span className="red-light"></span>}
                </p>
                <div className="button-group">
                  <button className="edit-button" onClick={() => handleEdit(ticket)}>Edit Ticket</button>
                  <button className="delete-button" onClick={() => handleDeleteClick(ticket)}>Delete Ticket</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isModalOpen && (
        <div className="modal1">
          <div className="modal-content1">
            <h3>Your ticket will no longer be available.</h3>
            <p>Are you sure you want to delete this ticket?</p>
            <div className="modal-buttons1">
              <button className="confirm-button" onClick={handleDelete}>Yes, Delete</button>
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTickets;

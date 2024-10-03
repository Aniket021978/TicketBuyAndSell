import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Live.css';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchUserTickets = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tickets/user/${userId}`);
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserTickets;

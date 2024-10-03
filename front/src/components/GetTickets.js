import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import "./getTickets.css";

const GetTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [area, setArea] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:5000/tickets");
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
        setFilteredTickets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleFilterApply = () => {
    let filtered = tickets;

    if (category) {
      filtered = filtered.filter(ticket => 
        ticket.title.trim().toLowerCase() === category.trim().toLowerCase()
      );
    }

    if (priceRange) {
      const priceRangeMap = {
        low: price => price <= 500,
        medium: price => price > 500 && price <= 1000,
        high: price => price > 1000 && price <= 5000,
        "very-high": price => price > 5000 && price <= 10000,
        "ultra-high": price => price > 10000 && price <= 50000,
        "mega-high": price => price > 50000 && price <= 100000,
      };
      filtered = filtered.filter(ticket => priceRangeMap[priceRange](parseFloat(ticket.price)));
    }

    if (area) {
      filtered = filtered.filter(ticket => 
        ticket.location.toLowerCase().includes(area.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
    setIsFilterOpen(false);
  };

  const handleClosePopup = () => {
    setIsFilterOpen(false);
    setCategory("");
    setPriceRange("");
    setArea("");
    setFilteredTickets(tickets);
    setSelectedTicket(null);
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleBuyNow = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="get-tickets-container">
      <div className="header">
        <h2>{selectedTicket ? "Ticket Details" : "Available Tickets"}</h2>
        <div className="buttons-container">
          {!selectedTicket && (
            <button className="filter-button" onClick={() => setIsFilterOpen(true)}>
              <FontAwesomeIcon icon={faFilter} /> Filter
            </button>
          )}
          <button className="home-button-get" onClick={handleHome}>
            Home
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="tickets-grid">
        {selectedTicket ? (
          <div className="ticket-card">
            <h3>{selectedTicket.title}</h3>
            {selectedTicket.image ? (
              <img src={selectedTicket.image} alt={selectedTicket.title} className="ticket-image" />
            ) : (
              <p className="para">No image available</p>
            )}
            <p>{selectedTicket.description}</p>
            <p className="price">Price: ₹{selectedTicket.price}</p>
            <p>Available: {selectedTicket.availability}</p>
            <p>Location: {selectedTicket.location}</p>
            <p>Seller Phone: {selectedTicket.phone}</p>
            <p>Seller Address: {selectedTicket.address}</p>
            <button className="back-button" onClick={handleBackToList}>Back to Tickets</button>
          </div>
        ) : (
          filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => (
              <div className="ticket-card" key={ticket._id}>
                <h3>{ticket.title}</h3>
                {ticket.image ? (
                  <img src={ticket.image} alt={ticket.title} className="ticket-image" />
                ) : (
                  <p>No image available</p>
                )}
                <p>{ticket.description}</p>
                <p className="price">Price: ₹{ticket.price}</p>
                <p>Available: {ticket.availability}</p>
                <p>Location: {ticket.location}</p>
                <button className="cta-button" onClick={() => handleBuyNow(ticket)}>Buy Now</button>
              </div>
            ))
          ) : (
            <p className="para">No tickets found with the selected filters.</p>
          )
        )}
      </div>

      {isFilterOpen && (
        <div className="backdrop" onClick={handleClosePopup}> 
          <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-get" onClick={handleClosePopup}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>Filter Tickets</h3>
            <div className="filter-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All</option>
                <option value="Sports">Sports</option>
                <option value="Concert">Concert</option>
                <option value="Movie">Movie</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Price Range</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="">All</option>
                <option value="low">Low (≤ ₹500)</option>
                <option value="medium">Medium (₹501 - ₹1000)</option>
                <option value="high">High (₹1001 - ₹5000)</option>
                <option value="very-high">Very High (₹5001 - ₹10000)</option>
                <option value="ultra-high">Ultra High (₹10001 - ₹50000)</option>
                <option value="mega-high">Mega High (₹50001 - ₹100000)</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Area</label>
              <input
                type="text"
                placeholder="Enter area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="filter-actions">
              <button className="apply-button" onClick={handleFilterApply}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetTickets;

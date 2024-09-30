import React, { useState } from 'react';
import SuccessMessage from './SuccessMessage';
import './MovieTicket.css';

const SportsTicket = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [ticketSaved, setTicketSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file.');
        return;
      }
      setImage(file);
      setErrorMessage('');
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z].*/.test(value) || value === '') {
      setLocation(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const userId = localStorage.getItem('userId');
    formData.append('title', 'Sports'); // Set the title to 'Sports' directly
    formData.append('description', description);
    formData.append('price', price);
    formData.append('availability', availability);
    formData.append('location', location);
    formData.append('image', image);
    formData.append('userId', userId);

    try {
      const response = await fetch('http://localhost:5000/tickets', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Ticket saved:', result);
        setTicketSaved(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to save ticket');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  if (ticketSaved) {
    return (
      <SuccessMessage
        ticket={{
          title: 'Sports',
          description,
          price,
          availability,
          location,
          image: image ? URL.createObjectURL(image) : '',
        }}
      />
    );
  }

  return (
    <div className="wrapper">
      <main>
        <h1 className='head'>Sell Your Sports Ticket</h1>
        <form className="ticket-form" onSubmit={handleSubmit} encType="multipart/form-data">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="form-group">
            <label htmlFor="category">Title:</label>
            <input
              type="text"
              id="category"
              value="Sports" // Fixed value for category
              readOnly
              style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', cursor: 'not-allowed' }} // Gray background
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="availability">Availability:</label>
            <input
              type="number"
              id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={handleLocationChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload Image:</label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
          </div>
          <button type="submit">Submit Ticket</button>
        </form>
      </main>
    </div>
  );
};

export default SportsTicket;

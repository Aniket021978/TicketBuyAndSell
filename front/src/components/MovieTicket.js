import React, { useState } from 'react';
import SuccessMessage from './SuccessMessage';
import './MovieTicket.css';

const MovieTicket = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
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
    formData.append('title', 'Movie');
    formData.append('description', description);
    formData.append('price', price);
    formData.append('availability', availability);
    formData.append('location', location);
    formData.append('image', image);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('userId', userId);

    try {
      const response = await fetch('https://ticket-buy-and-sell-back.vercel.app/tickets', {
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
          title: 'Movie',
          description,
          price,
          availability,
          location,
          image: image ? URL.createObjectURL(image) : '',
          phone,
          address,
        }}
      />
    );
  }

  return (
    <div className="wrapper1">
      <main className="ticket-box1">
        <h1 className='head1'>Sell Your Movie Ticket</h1>
        <form className="ticket-form1" onSubmit={handleSubmit} encType="multipart/form-data">
          {errorMessage && <p className="error-message1">{errorMessage}</p>}
          <div className="form-group1">
            <label htmlFor="category" className="label1">Title:</label>
            <input
              type="text"
              id="category"
              value="Movie"
              readOnly
              className="input-readonly1"
            />
          </div>
          <div className="form-group1">
            <label htmlFor="description" className="label1">Description:</label>
            <textarea id="description" className="textarea1" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group1">
            <label htmlFor="price" className="label1">Price:</label>
            <input type="number" id="price" className="input-number1" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
          </div>
          <div className="form-group1 avail">
            <label htmlFor="availability" className="label1">Availability:</label>
            <input
              type="number"
              id="availability"
              className="input-number1"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className="form-group1 loc">
            <label htmlFor="location" className="label1">Location:</label>
            <input
              type="text"
              id="location"
              className="input-text1"
              value={location}
              onChange={handleLocationChange}
              required
            />
          </div>
          <div className="form-group1 phone">
            <label htmlFor="phone" className="label1">Enter Correct Phone Number So That Buyer Contact you:</label>
            <input
              type="text"
              id="phone"
              className="input-text1"
              value={phone}
              onChange={handlePhoneChange}
              required
              maxLength="10"
            />
          </div>
          <div className="form-group1 full">
            <label htmlFor="address" className="label1">Enter Correct Full Address So That Buyer Contact you:</label>
            <textarea
              id="address"
              className="textarea1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="image" className="label1">Upload Image:</label>
            <input type="file" id="image" accept="image/*" className="input-file1" onChange={handleImageChange} required />
          </div>
          <button type="submit" className="button1">Submit Ticket</button>
        </form>
      </main>
    </div>
  );
};

export default MovieTicket;

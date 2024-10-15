import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SuccessMessage from './SuccessMessage';
import './MovieTicket.css';

const ConcertTicket = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [YourLocation, setYourLocation] = useState('');
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ticketSaved, setTicketSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageName, setImageName] = useState('');

  const location = useLocation();
  const ticket = location.state?.ticket;

  useEffect(() => {
    if (ticket) {
      setDescription(ticket.description);
      setPrice(ticket.price);
      setAvailability(ticket.availability);
      setYourLocation(ticket.location);
      setPhone(ticket.phone);
      setAddress(ticket.address);
      setImage(ticket.image);
      setImageName(ticket.image.split('/').pop());
    }
  }, [ticket]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file.');
        return;
      }
      setImage(file);
      setImageName(file.name);
      setErrorMessage('');
    } else {
      setImageName('');
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
      setYourLocation(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const userId = localStorage.getItem('userId');

    if (!description || !price || !availability || !YourLocation || !phone || !address) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    if (!image && !ticket) {
      setErrorMessage('Please upload an image or keep the existing one.');
      return;
    }

    formData.append('title', 'Movie');
    formData.append('description', description);
    formData.append('price', price);
    formData.append('availability', availability);
    formData.append('location', YourLocation);
    formData.append('image', image);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('userId', userId);

    try {
      const url = ticket ? `http://localhost:5000/tickets/${ticket._id}` : 'http://localhost:5000/tickets';
      const method = ticket ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData,
      });
      console.log('Response status:', response.status);
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
          location: YourLocation,
          image: image instanceof File ? URL.createObjectURL(image) : (image ? image : ''),
          phone,
          address,
        }}
      />
    );
  }

  return (
    <div className="wrapper1">
      <main className='ticket-box1'>
        <h1 className='head1'>{ticket ? 'Edit Movie Ticket' : 'Sell Your Movie Ticket'}</h1>
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
              value={YourLocation}
              onChange={handleLocationChange}
              required
            />
          </div>
          <div className="form-group1 phone">
            <label htmlFor="phone" className="label1">Phone Number:</label>
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
            <label htmlFor="address" className="label1">Full Address:</label>
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
            <input type="file" id="image" accept="image/*" className="input-file1" onChange={handleImageChange} />
            <span>{imageName}</span>
          </div>
          <button type="submit" className="button1">{ticket ? 'Update Ticket' : 'Submit Ticket'}</button>
        </form>
      </main>
    </div>
  );
};

export default ConcertTicket;

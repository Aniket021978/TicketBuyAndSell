import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      message,
    };

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleSubmitAnother = () => {
    setSuccessMessage(false);
  };

  return (
    <div className='contact-page'>
      <Link to="/" className="home-button">Home</Link>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <h2 className="contact-heading">Contact Us</h2>
      {!successMessage ? ( 
      <form className={`contact-form ${isLoading ? 'blurred' : ''}`} onSubmit={handleSubmit}>
        <div className="form-group2">
          <label className="form-label2" htmlFor="name">Name:</label>
          <input
            className="form-input2"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group2">
          <label className="form-label2" htmlFor="email">Email:</label>
          <input
            className="form-input2"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group2">
          <label className="form-label2" htmlFor="message">Message:</label>
          <textarea
            className="form-input2"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button className="submit-contact" type="submit">Send Message</button>
      </form>
      ):(  
        <div className="success-message">
          <div className="tick-icon">&#10003;</div>
          <p>Your message has been sent successfully!</p>
          <button onClick={handleNavigateHome} className="nav-button">Go to Home</button>
          <button onClick={handleSubmitAnother} className="nav-button">Submit Another Response</button>
        </div>
      )}
    </div>
  );
};

export default Contact;

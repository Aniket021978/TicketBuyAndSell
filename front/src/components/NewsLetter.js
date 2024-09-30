import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './NewsLetter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';

const NewsLetter = (props) => {
  return (
    <div className="contact10-container1">
  <div className="contact10-left-side">
  <div className="contact10-subscribe-section">
  <h3>Subscribe to our newsletter</h3> 
  <p>Get the latest updates on features and releases.</p>
  <div className="contact10-email-input-wrapper">
    <input type="email" placeholder="Enter your email" className="contact10-email-input" />
    <button className="contact10-subscribe-button">Subscribe</button>
  </div>
</div>

  </div>
  
  <div className="contact10-right-side">
    <div className="contact10-section">
      <h3>Company</h3>
      <a href="#">Home</a>
      <a href="#">Buy Tickets</a>
      <a href="#">Sell Tickets</a>
      <a href="#">Contact Us</a>
    </div>
    <div className="contact10-section">
      <h3>Quick Links</h3>
      <a href="#">FAQs</a>
      <a href="#">Terms of Service</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Cookie Policy</a>
    </div>
    <div className="contact10-section">
      <h3>Follow Us</h3>
      <a href="#" aria-label="Facebook">
        <FontAwesomeIcon icon={faFacebook} /> Facebook
      </a>
      <a href="#" aria-label="Instagram">
        <FontAwesomeIcon icon={faInstagram} /> Instagram
      </a>
      <a href="#" aria-label="Twitter">
        <FontAwesomeIcon icon={faTwitter} /> Twitter
      </a>
      <a href="#" aria-label="LinkedIn">
        <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
      </a>
      <a href="#" aria-label="YouTube">
        <FontAwesomeIcon icon={faYoutube} /> YouTube
      </a>
    </div>
  </div>
</div>

  );
};

NewsLetter.propTypes = {
  content1: PropTypes.element,
  location2ImageSrc: PropTypes.string,
  location1ImageSrc: PropTypes.string,
  location1Description: PropTypes.element,
  location2ImageAlt: PropTypes.string,
  heading1: PropTypes.element,
  location2Description: PropTypes.element,
  location1ImageAlt: PropTypes.string,
  location1: PropTypes.element,
  location2: PropTypes.element,
};

export default NewsLetter;


# Buy and Sell Website

## Overview

This project is a full-stack buy and sell website developed using **Node.js**, **Express**, and **MongoDB** for the backend, and **React** for the frontend. It enables users to securely register, log in, and manage their products and tickets. The platform also features OTP verification for added security and a contact form for user inquiries.

## Features

- **User Authentication**: 
  - Secure user registration and login functionalities using JWT (JSON Web Tokens).
  
- **OTP Verification**: 
  - Users receive One-Time Passwords (OTP) via email to confirm their identity during login.

- **Contact Form**: 
  - A form that allows users to send inquiries directly via email.

- **Product Listings**: 
  - Users can view, add, edit, and delete their product listings.

- **Live Page**: 
  - Users can view the products they have sold, along with the details of each sale.

- **Ticket Management**: 
  - Users can view all tickets available, with options to filter and search based on various criteria.

- **Responsive Design**: 
  - The website is designed to be mobile-friendly, ensuring a seamless user experience across devices.

## Tech Stack

- **Frontend**: 
  - **React**: JavaScript library for building user interfaces, utilizing hooks and state management for dynamic functionality.
  
- **Backend**: 
  - **Node.js**: JavaScript runtime for building scalable server-side applications.
  - **Express.js**: A minimalist web framework for Node.js, facilitating routing and middleware integration.
  - **MongoDB**: A NoSQL database for flexible data storage, used for user data and product listings.
  - **Nodemailer**: A module for sending emails, used for the contact form and OTP functionality.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **MongoDB** (either a local installation or a cloud instance like MongoDB Atlas)
- **npm** (Node package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd back
     ```
   - Install the backend dependencies:
     ```bash
     npm install

    ```
     PORT=3000
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../front
     ```
   - Install the frontend dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

### API Endpoints

- **Authentication**
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in an existing user.
  - `POST /api/auth/verify-otp`: Verify OTP for authentication.

- **Products**
  - `GET /api/products`: Fetch all products.
  - `POST /api/products`: Add a new product.
  - `PUT /api/products/:id`: Update an existing product.
  - `DELETE /api/products/:id`: Delete a product.
  - `GET /api/sold-products`: Get products sold by the user.

- **Tickets**
  - `GET /api/tickets`: Fetch all tickets with filtering options.

- **Contact**
  - `POST /api/contact`: Send an email through the contact form.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://reactjs.org/)
- [Nodemailer](https://nodemailer.com/)
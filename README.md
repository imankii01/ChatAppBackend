
##ChatAppBackend - Backend for Chat Application

This repository contains the backend implementation for a **real-time chat application**. Built with **Node.js**, this backend provides essential features such as authentication, user management, message handling, and OTP verification, enabling a fully functional chat system.

---

## Features

- **User Authentication**: Implements JWT-based authentication for secure user login and registration.
- **Real-time Messaging**: Handles the sending and receiving of messages between users.
- **OTP Verification**: Provides OTP (One-Time Password) functionality for user verification during registration.
- **Message Storage**: Stores user messages in a MongoDB database.
- **Middleware for Security**: Protects API routes with authentication middleware to ensure only authorized users can access certain endpoints.

---

## API Endpoints

Here are some key API endpoints implemented in the backend:

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in an existing user and generate a JWT.
- **GET /api/messages**: Retrieve all messages between users.
- **POST /api/messages**: Send a new message.
- **POST /api/auth/otp**: Send an OTP to the user's email for verification.

---

## Project Structure

- **authMiddleware.js**: Middleware for user authentication (verifies JWT tokens).
- **index.js**: Entry point for the server; connects the app to MongoDB and initializes routes.
- **models.js**: Contains Mongoose models for the user and message schemas.
- **otpStore.js**: Handles OTP generation and validation.
- **package.json**: Contains the project dependencies and scripts.
- **userController.js**: Contains the business logic for user authentication and message handling.
- **utils.js**: Utility functions, including password hashing and token verification.

---

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend server.
- **Express.js**: Web framework for handling HTTP requests and routing.
- **MongoDB**: NoSQL database used to store user data and chat messages.
- **JWT (JSON Web Tokens)**: Used for securing API routes with token-based authentication.
- **Nodemailer**: For sending OTP emails to users.
- **Bcrypt.js**: For securely hashing and storing passwords.

---

## How to Get Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/imankii01/ChatAppBackend.git
   cd ChatAppBackend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file**:
   Create a `.env` file in the root directory and add the following environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OTP_SECRET=your_otp_secret_key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

   The backend server should now be running and listening for incoming requests.

---

## Contributing

Feel free to fork this repository and create pull requests with improvements. Whether you add new features or improve existing ones, contributions are always welcome.

- **GitHub**: [imankii01](https://github.com/imankii01)
- **Hashnode Blog**: [imankit.hashnode.dev](https://imankit.hashnode.dev)

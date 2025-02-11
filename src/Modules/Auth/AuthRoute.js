const express = require('express');
const AuthRoute = express.Router();
const AuthController = require('./AuthController');

// Send OTP
AuthRoute.post('/send-otp', AuthController.sendOtp);

// Verify OTP
AuthRoute.post('/check-otp', AuthController.checkOtp);

// Register
AuthRoute.post('/register', AuthController.register);

// Login
AuthRoute.post('/login', AuthController.login);

module.exports = AuthRoute;
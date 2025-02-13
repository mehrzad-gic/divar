const express = require('express');
const CityRoute = express.Router();
const CityController = require('./CityController');

// Get all cities
CityRoute.get('/cities', CityController.all);

// Create a new city
CityRoute.post('/create-city', CityController.create);

// Get city by slug
CityRoute.get('/city-detail/:slug', CityController.detail);

// Update city by slug
CityRoute.put('/update-city/:slug', CityController.update);

// Delete city by slug
CityRoute.delete('/delete-city/:slug', CityController.delete);

// Change city status
CityRoute.patch('/change-city-status/:slug', CityController.changeStatus);

module.exports = CityRoute;
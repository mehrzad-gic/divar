const express = require('express');
const ProvinceRoute = express.Router();
const ProvinceController = require('./ProvinceController');

// Get all provinces
ProvinceRoute.get('/provinces', ProvinceController.all);

// Create a new province
ProvinceRoute.post('/create-province', ProvinceController.create);

// Get province by ID
ProvinceRoute.get('/province-detail/:slug', ProvinceController.detail);

// Update province by ID
ProvinceRoute.put('/update-province/:slug', ProvinceController.update);

// Delete province by ID
ProvinceRoute.delete('/delete-province/:slug', ProvinceController.delete);

// Change province status
ProvinceRoute.patch('/change-province-status/:slug', ProvinceController.changeStatus);

module.exports = ProvinceRoute;
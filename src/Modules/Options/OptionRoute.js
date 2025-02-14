const express = require('express');
const OptionRoute = express.Router();
const OptionController = require('./OptionController');

// Get all options
OptionRoute.get('/options', OptionController.all);

// Create a new option
OptionRoute.post('/create-option', OptionController.create);

// Get option by ID
OptionRoute.get('/option-detail/:id', OptionController.detail);

// Update option by ID
OptionRoute.put('/update-option/:id', OptionController.update);

// Delete option by ID
OptionRoute.delete('/delete-option/:id', OptionController.delete);

module.exports = OptionRoute;
const express = require('express');
const CategoryRoute = express.Router();
const CategoryController = require('./CategoryController'); // Adjust the path as necessary

// Get all categories
CategoryRoute.get('/categories', CategoryController.all);

// Create a new category
CategoryRoute.post('/create-category', CategoryController.create);

// Get category by slug
CategoryRoute.get('/category-detail/:slug', CategoryController.detail);

// Update a category by slug
CategoryRoute.put('/update-category/:slug', CategoryController.update);

// Delete a category by slug
CategoryRoute.delete('/delete-category/:slug', CategoryController.delete);

// Change the status of a category by slug
CategoryRoute.patch('/change-category-status/:slug', CategoryController.changeStatus);

// Export the router
module.exports = CategoryRoute;

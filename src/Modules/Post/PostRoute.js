const express = require('express');
const PostRoute = express.Router();
const PostController = require('./PostController');

// Get all posts
PostRoute.get('/', PostController.all);

// Create a new post
PostRoute.post('/create-post', PostController.create);

// Get post by slug
PostRoute.get('/post-detail/:slug', PostController.detail);

// Update post by slug
PostRoute.put('/update-post/:slug', PostController.update);

// Delete post by slug
PostRoute.delete('/delete-post/:slug', PostController.delete);

module.exports = PostRoute;
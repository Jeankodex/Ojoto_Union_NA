const express = require('express');
const router = express.Router();
const CommunityController = require('../controllers/communityController');
const { verifyToken } = require('../utils/auth');

// All community routes require authentication
router.use(verifyToken);

// POST ROUTES
router.post('/posts', CommunityController.createPost);           // Create post
router.get('/posts', CommunityController.getPosts);              // Get all posts
router.get('/posts/:id', CommunityController.getPost);           // Get single post
router.post('/posts/:id/like', CommunityController.likePost);    // Like a post

// COMMENT ROUTES
router.post('/posts/:id/comments', CommunityController.addComment);  // Add comment
router.get('/posts/:id/comments', CommunityController.getComments);  // Get comments

module.exports = router;
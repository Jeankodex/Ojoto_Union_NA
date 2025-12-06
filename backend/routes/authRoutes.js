const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../utils/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (need token)
router.get('/me', verifyToken, getCurrentUser);
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});

module.exports = router;
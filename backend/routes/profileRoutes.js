
//routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserById, getAllProfiles } = require('../controllers/profileController');
const { verifyToken } = require('../utils/auth');

router.get('/', verifyToken, getProfile);       // GET /api/profile
router.put('/', verifyToken, updateProfile);    // PUT /api/profile
router.get('/:id', verifyToken, getUserById);   // GET /api/profile/:id
router.get('/all', getAllProfiles); // Note: This is public


module.exports = router;


//routes/volunteerRoutes.js
const express = require('express');
const router = express.Router();
const VolunteerController = require('../controllers/volunteerController');
const {verifyToken} = require('../utils/auth');

// Public routes
router.get('/opportunities', VolunteerController.getOpportunities);
router.get('/opportunities/:id', VolunteerController.getOpportunity);

// Protected routes (require authentication)
router.use(verifyToken);

// Volunteer opportunities CRUD
router.post('/opportunities', VolunteerController.createOpportunity);

// Applications
router.post('/opportunities/:id/apply', VolunteerController.createApplication);
router.get('/applications/my', VolunteerController.getUserApplications);
router.get('/opportunities/:id/applications', VolunteerController.getOpportunityApplications);
router.put('/applications/:applicationId/status', VolunteerController.updateApplicationStatus);

module.exports = router;
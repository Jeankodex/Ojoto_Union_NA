
const Volunteer = require('../models/Volunteer');

class VolunteerController {
    // CREATE VOLUNTEER OPPORTUNITY
    static async createOpportunity(req, res) {
        try {
            const userId = req.userId;
            const {
                title, organization, description, category, location,
                time_commitment, skills_needed, requirements, is_urgent,
                contact_email, contact_phone, date, slots
            } = req.body;
            
            // Validation
            if (!title || !organization || !description || !category || !location || !date) {
                return res.status(400).json({
                    success: false,
                    error: 'Title, organization, description, category, location, and date are required'
                });
            }
            
            const opportunityData = {
                title,
                organization,
                description,
                category,
                location,
                time_commitment: time_commitment || '',
                skills_needed: skills_needed || '',
                requirements: requirements || '',
                is_urgent: Boolean(is_urgent),
                contact_email: contact_email || '',
                contact_phone: contact_phone || '',
                date,
                slots: slots || 1
            };
            
            const newOpportunity = await Volunteer.createOpportunity(userId, opportunityData);
            
            res.status(201).json({
                success: true,
                message: 'Volunteer opportunity created successfully',
                data: newOpportunity
            });
            
        } catch (error) {
            console.error('Create volunteer opportunity error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create volunteer opportunity'
            });
        }
    }
    
    // GET ALL OPPORTUNITIES
    static async getOpportunities(req, res) {
        try {
            const filters = {
                category: req.query.category || 'all',
                search: req.query.search || '',
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20
            };
            
            const result = await Volunteer.getOpportunities(filters);
            
            res.json({
                success: true,
                message: 'Volunteer opportunities retrieved successfully',
                data: result.opportunities,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                }
            });
            
        } catch (error) {
            console.error('Get volunteer opportunities error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve volunteer opportunities'
            });
        }
    }
    
    // GET SINGLE OPPORTUNITY
    static async getOpportunity(req, res) {
        try {
            const opportunityId = parseInt(req.params.id);
            
            const opportunity = await Volunteer.getOpportunityById(opportunityId);
            
            if (opportunity) {
                // Get application stats
                const stats = await Volunteer.getOpportunityStats(opportunityId);
                
                res.json({
                    success: true,
                    message: 'Volunteer opportunity retrieved successfully',
                    data: {
                        ...opportunity,
                        applications_count: stats.total_applications || 0,
                        approved_count: stats.approved_count || 0,
                        pending_count: stats.pending_count || 0
                    }
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Volunteer opportunity not found'
                });
            }
            
        } catch (error) {
            console.error('Get volunteer opportunity error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve volunteer opportunity'
            });
        }
    }
    
    // CREATE APPLICATION
    static async createApplication(req, res) {
        try {
            const opportunityId = parseInt(req.params.id);
            const userId = req.userId;
            const { skills, message } = req.body;
            
            // Validation
            if (!skills || skills.trim().length < 10) {
                return res.status(400).json({
                    success: false,
                    error: 'Please provide your skills and experience (minimum 10 characters)'
                });
            }
            
            // Check if opportunity exists
            const opportunity = await Volunteer.getOpportunityById(opportunityId);
            if (!opportunity) {
                return res.status(404).json({
                    success: false,
                    error: 'Volunteer opportunity not found'
                });
            }
            
            // Check if opportunity is still open
            if (opportunity.status !== 'open') {
                return res.status(400).json({
                    success: false,
                    error: 'This volunteer opportunity is no longer accepting applications'
                });
            }
            
            const applicationData = {
                skills: skills.trim(),
                message: message ? message.trim() : ''
            };
            
            const application = await Volunteer.createApplication(opportunityId, userId, applicationData);
            
            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                data: application
            });
            
        } catch (error) {
            console.error('Create application error:', error);
            if (error.message === 'You have already applied for this opportunity') {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
            res.status(500).json({
                success: false,
                error: 'Failed to submit application'
            });
        }
    }
    
    // GET USER'S APPLICATIONS
    static async getUserApplications(req, res) {
        try {
            const userId = req.userId;
            
            const applications = await Volunteer.getUserApplications(userId);
            
            res.json({
                success: true,
                message: 'Applications retrieved successfully',
                data: applications
            });
            
        } catch (error) {
            console.error('Get user applications error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve applications'
            });
        }
    }
    
    // GET OPPORTUNITY APPLICATIONS (for opportunity creator)
    static async getOpportunityApplications(req, res) {
        try {
            const opportunityId = parseInt(req.params.id);
            const userId = req.userId;
            
            // Check if user is the creator of this opportunity
            const opportunity = await Volunteer.getOpportunityById(opportunityId);
            if (!opportunity) {
                return res.status(404).json({
                    success: false,
                    error: 'Volunteer opportunity not found'
                });
            }
            
            if (opportunity.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'You are not authorized to view applications for this opportunity'
                });
            }
            
            const applications = await Volunteer.getApplications(opportunityId);
            
            res.json({
                success: true,
                message: 'Applications retrieved successfully',
                data: applications
            });
            
        } catch (error) {
            console.error('Get opportunity applications error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve applications'
            });
        }
    }
    
    // UPDATE APPLICATION STATUS
    static async updateApplicationStatus(req, res) {
        try {
            const applicationId = parseInt(req.params.applicationId);
            const { status } = req.body;
            
            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Status must be either "approved" or "rejected"'
                });
            }
            
            const updated = await Volunteer.updateApplicationStatus(applicationId, status);
            
            if (updated) {
                res.json({
                    success: true,
                    message: `Application ${status} successfully`
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Application not found'
                });
            }
            
        } catch (error) {
            console.error('Update application status error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update application status'
            });
        }
    }
}

module.exports = VolunteerController;
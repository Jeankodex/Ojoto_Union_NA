

//profileController.js
const { db } = require('../utils/db');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        console.log('🔹 getProfile called, userId from token:', userId);
        
        const profile = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    u.*,
                    p.*,
                    us.*
                FROM users u
                LEFT JOIN profiles p ON u.id = p.user_id
                LEFT JOIN user_stats us ON u.id = us.user_id
                WHERE u.id = ?
            `, [userId], (err, row) => {
                if (err) {
                    console.error('❌ SQL error in getProfile:', err);
                    reject(err);
                } else {
                    console.log('🔹 Row fetched from DB:', row);
                    resolve(row);
                }
            });
        });

        if (!profile) {
            console.log('⚠️ No profile found for userId:', userId);
            return res.status(404).json({ error: 'Profile not found' });
        }
        console.log('✅ Profile found:', profile);

        res.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch profile', 
            details: error.message 
        });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            full_name, title, profession, specialization, 
            location, bio, linkedin, website,
            skills, education, experience, languages,
            contact_preferences, privacy_settings
        } = req.body;

        // Update profile
        await new Promise((resolve, reject) => {
            const sql = `
                UPDATE profiles SET
                    full_name = COALESCE(?, full_name),
                    title = COALESCE(?, title),
                    profession = COALESCE(?, profession),
                    specialization = COALESCE(?, specialization),
                    location = COALESCE(?, location),
                    bio = COALESCE(?, bio),
                    linkedin = COALESCE(?, linkedin),
                    website = COALESCE(?, website),
                    skills = COALESCE(?, skills),
                    education = COALESCE(?, education),
                    experience = COALESCE(?, experience),
                    languages = COALESCE(?, languages),
                    contact_preferences = COALESCE(?, contact_preferences),
                    privacy_settings = COALESCE(?, privacy_settings),
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `;
            db.run(sql, [
                full_name, title, profession, specialization,
                location, bio, linkedin, website,
                JSON.stringify(skills), JSON.stringify(education), 
                JSON.stringify(experience), JSON.stringify(languages),
                JSON.stringify(contact_preferences), JSON.stringify(privacy_settings),
                userId
            ], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            error: 'Failed to update profile', 
            details: error.message 
        });
    }
};

// Get user by ID (for member detail)
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    u.id, u.email, u.username, u.first_name, u.surname, 
                    u.phone, u.profile_picture, u.role, u.created_at,
                    p.full_name, p.title, p.profession, p.specialization,
                    p.location, p.bio, p.linkedin, p.website,
                    p.skills, p.education, p.experience, p.languages,
                    p.contact_preferences, p.privacy_settings,
                    us.posts_count, us.comments_count, us.questions_count,
                    us.answers_count, us.connections_count, us.events_attended,
                    us.last_active
                FROM users u
                LEFT JOIN profiles p ON u.id = p.user_id
                LEFT JOIN user_stats us ON u.id = us.user_id
                WHERE u.id = ?
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch user', 
            details: error.message 
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getUserById
};
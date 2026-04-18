// controllers/profileController.js - PostgreSQL Version
const { query } = require('../database/init'); 

// ✅ Safe JSON parser (handles both string + object)
const safeParse = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    const result = await query(`
      SELECT u.*, p.*, us.*
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = $1
    `, [userId]);
    
    const profile = result.rows[0];

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // ✅ Parse JSON fields safely
    profile.skills = safeParse(profile.skills, []);
    profile.education = safeParse(profile.education, []);
    profile.experience = safeParse(profile.experience, []);
    profile.languages = safeParse(profile.languages, []);
    profile.contact_preferences = safeParse(profile.contact_preferences, {});
    profile.privacy_settings = safeParse(profile.privacy_settings, {});

    res.json({ success: true, profile });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;
    
    console.log('📦 Backend received:', data);

    await query(`
      UPDATE profiles SET
        full_name = $1,
        title = $2,
        profession = $3,
        specialization = $4,
        location = $5,
        bio = $6,
        linkedin = $7,
        website = $8,
        skills = $9,
        education = $10,
        experience = $11,
        languages = $12,
        contact_preferences = $13,
        privacy_settings = $14,
        updated_at = NOW()
      WHERE user_id = $15
    `, [
      data.full_name || '',
      data.title || '',
      data.profession || '',
      data.specialization || '',
      data.location || '',
      data.bio || '',
      data.linkedin || '',
      data.website || '',
      JSON.stringify(data.skills || []),
      JSON.stringify(data.education || []),
      JSON.stringify(data.experience || []),
      JSON.stringify(data.languages || []),
      
      // ✅ Always stringify (fixes bug)
      JSON.stringify(
        data.contact_preferences || {
          email: true,
          phone: true,
          linkedin: true,
          inPerson: true
        }
      ),
      
      JSON.stringify(
        data.privacy_settings || {
          profileVisibility: "members",
          contactVisibility: "members",
          activityVisibility: "public"
        }
      ),

      userId
    ]);

    console.log('✅ Profile updated');

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update profile'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }
    
    const result = await query(`
      SELECT u.*, p.*, us.*
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = $1
    `, [userId]);
    
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Parse JSON fields
    user.skills = safeParse(user.skills, []);
    user.education = safeParse(user.education, []);
    user.experience = safeParse(user.experience, []);
    user.languages = safeParse(user.languages, []);
    user.contact_preferences = safeParse(user.contact_preferences, {});
    user.privacy_settings = safeParse(user.privacy_settings, {});

    res.json({ success: true, user });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// GET ALL PUBLIC PROFILES
const getAllProfiles = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.id,
        u.first_name,
        u.surname,
        u.email,
        u.phone,
        u.is_online,
        u.created_at,
        u.role,
        p.profile_picture,
        p.full_name,
        p.title,
        p.profession,
        p.specialization,
        p.location,
        p.bio,
        p.linkedin,
        p.website,
        p.skills,
        p.education,
        p.experience,
        p.languages,
        p.privacy_settings
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.role = 'member' 
      AND (p.privacy_settings IS NULL OR 
           p.privacy_settings->>'profileVisibility' IN ('public', 'members'))
      ORDER BY u.created_at DESC
    `);
    
    const profiles = result.rows;

    const parsedProfiles = profiles.map(profile => ({
      ...profile,
      skills: safeParse(profile.skills, []),
      education: safeParse(profile.education, []),
      experience: safeParse(profile.experience, []),
      languages: safeParse(profile.languages, []),
      privacy_settings: safeParse(profile.privacy_settings, {})
    }));

    res.json({ success: true, data: parsedProfiles });

  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve profiles' 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  getAllProfiles
};
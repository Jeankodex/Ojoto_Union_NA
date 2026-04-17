// controllers/authController.js
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { query } = require('../database/init'); // ← Changed import

// Register user
const registerUser = async (req, res) => {
  try {
    const { 
      email, 
      username, 
      password, 
      firstName, 
      surname, 
      phone, 
      agreeTerms 
    } = req.body;

    // Validate required fields
    if (!email || !username || !password || !firstName || !surname) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens' 
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password.trim())) {
      return res.status(400).json({
        error: 'Password must contain uppercase, lowercase, number and special character and be at least 8 characters long',
      });
    }

    // Check if user exists (PostgreSQL version)
    const existingResult = await query(
      'SELECT id, email, username FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    const existingUser = existingResult.rows[0];

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ error: `User with this ${field} already exists`, field });
    }

    // Validate phone if provided (Nigerian format)
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const phoneRegex = /^(?:\+?234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please provide a valid Nigerian phone number' });
    }

    // Check terms agreement
    if (!agreeTerms) {
      return res.status(400).json({ error: 'You must agree to the terms and conditions' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    let userId;
    try {
      // Start transaction (PostgreSQL)
      await query('BEGIN');

      // Insert user with RETURNING to get ID
      const userResult = await query(
        `INSERT INTO users 
         (email, username, password_hash, first_name, surname, phone, agree_terms) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [email, username, hashedPassword, firstName, surname, phone || null, agreeTerms]
      );
      userId = userResult.rows[0].id;

      // Create profile with default images
      await query(
        `INSERT INTO profiles 
         (user_id, full_name, profile_picture, cover_photo, contact_preferences, privacy_settings) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userId, 
          `${firstName} ${surname}`,
          'default.png',
          'default-cover.jpg',
          JSON.stringify({ email: true, phone: !!phone, linkedin: false, inPerson: false }),
          JSON.stringify({ profileVisibility: "members", contactVisibility: "members", activityVisibility: "public" })
        ]
      );

      // Create user stats
      await query('INSERT INTO user_stats (user_id) VALUES ($1)', [userId]);

      // Commit transaction
      await query('COMMIT');

    } catch (error) {
      // Rollback on error
      await query('ROLLBACK').catch(() => {}); // Ignore rollback errors
      throw error;
    }

    // Generate token
    const token = generateToken(userId);

    // Get complete user data (PostgreSQL version)
    const newUserResult = await query(`
      SELECT 
        u.id, u.email, u.username, u.first_name, u.surname, 
        u.phone, u.role, u.created_at, u.is_verified, u.is_online,
        p.full_name, p.title, p.profession, p.specialization,
        p.location, p.bio, p.linkedin, p.website,
        p.profile_picture, p.cover_photo,
        p.contact_preferences, p.privacy_settings,
        us.posts_count, us.comments_count, us.questions_count,
        us.answers_count, us.connections_count, us.events_attended,
        us.last_active
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = $1
    `, [userId]);
    
    const newUser = newUserResult.rows[0];

    // Parse JSON strings
    const parsedUser = {
      ...newUser,
      contact_preferences: newUser.contact_preferences ? JSON.parse(newUser.contact_preferences) : {},
      privacy_settings: newUser.privacy_settings ? JSON.parse(newUser.privacy_settings) : {}
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: parsedUser.id,
        email: parsedUser.email,
        username: parsedUser.username,
        firstName: parsedUser.first_name,
        surname: parsedUser.surname,
        phone: parsedUser.phone,
        role: parsedUser.role,
        profilePicture: parsedUser.profile_picture,
        coverPhoto: parsedUser.cover_photo,
        isVerified: parsedUser.is_verified,
        isOnline: parsedUser.is_online,
        fullName: parsedUser.full_name,
        title: parsedUser.title,
        profession: parsedUser.profession,
        specialization: parsedUser.specialization,
        location: parsedUser.location,
        bio: parsedUser.bio,
        linkedin: parsedUser.linkedin,
        website: parsedUser.website,
        contactPreferences: parsedUser.contact_preferences,
        privacySettings: parsedUser.privacy_settings,
        stats: {
          posts: parsedUser.posts_count || 0,
          comments: parsedUser.comments_count || 0,
          questions: parsedUser.questions_count || 0,
          answers: parsedUser.answers_count || 0,
          connections: parsedUser.connections_count || 0,
          events: parsedUser.events_attended || 0
        },
        createdAt: parsedUser.created_at,
        lastActive: parsedUser.last_active
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle PostgreSQL unique violation (code 23505)
    let errorMessage = 'Registration failed';
    if (error.code === '23505') {
      if (error.detail && error.detail.includes('email')) {
        errorMessage = 'Email already exists';
      } else if (error.detail && error.detail.includes('username')) {
        errorMessage = 'Username already exists';
      }
    }
    
    res.status(500).json({ 
      success: false,
      error: errorMessage, 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user (PostgreSQL version)
const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, error: 'Email/username and password are required' });
    }

    // Find user (PostgreSQL)
    const userResult = await query(`
      SELECT 
        u.*,
        p.full_name, p.title, p.profession, p.specialization,
        p.location, p.bio, p.linkedin, p.website,
        p.profile_picture, p.cover_photo,
        p.contact_preferences, p.privacy_settings,
        us.posts_count, us.comments_count, us.questions_count,
        us.answers_count, us.connections_count, us.events_attended,
        us.last_active
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.email = $1 OR u.username = $1
    `, [emailOrUsername]);
    
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email/username or password' });
    }

    // Check if account is verified (PostgreSQL boolean)
    if (user.is_verified === false) {
      return res.status(403).json({ 
        success: false,
        error: 'Account not verified. Please check your email.',
        requiresVerification: true,
        userId: user.id
      });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email/username or password' });
    }

    // Update is_online status (PostgreSQL)
    await query('UPDATE users SET is_online = $1 WHERE id = $2', [true, user.id]);

    // Update last active
    await query('UPDATE user_stats SET last_active = NOW() WHERE user_id = $1', [user.id]);

    // Generate token
    const token = generateToken(user.id);

    // Parse JSON strings
    const parsedUser = {
      ...user,
      contact_preferences: user.contact_preferences ? JSON.parse(user.contact_preferences) : {},
      privacy_settings: user.privacy_settings ? JSON.parse(user.privacy_settings) : {}
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: parsedUser.id,
        email: parsedUser.email,
        username: parsedUser.username,
        firstName: parsedUser.first_name,
        surname: parsedUser.surname,
        phone: parsedUser.phone,
        role: parsedUser.role,
        profilePicture: parsedUser.profile_picture,
        coverPhoto: parsedUser.cover_photo,
        isVerified: parsedUser.is_verified,
        isOnline: parsedUser.is_online,
        fullName: parsedUser.full_name,
        title: parsedUser.title,
        profession: parsedUser.profession,
        specialization: parsedUser.specialization,
        location: parsedUser.location,
        bio: parsedUser.bio,
        linkedin: parsedUser.linkedin,
        website: parsedUser.website,
        contactPreferences: parsedUser.contact_preferences,
        privacySettings: parsedUser.privacy_settings,
        stats: {
          posts: parsedUser.posts_count || 0,
          comments: parsedUser.comments_count || 0,
          questions: parsedUser.questions_count || 0,
          answers: parsedUser.answers_count || 0,
          connections: parsedUser.connections_count || 0,
          events: parsedUser.events_attended || 0
        },
        createdAt: parsedUser.created_at,
        lastActive: parsedUser.last_active
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current user (PostgreSQL version)
const getCurrentUser = async (req, res) => {
  try {
    const userResult = await query(`
      SELECT 
        u.*,
        p.full_name, p.title, p.profession, p.specialization,
        p.location, p.bio, p.linkedin, p.website,
        p.profile_picture, p.cover_photo,
        p.skills, p.education, p.experience, p.languages,
        p.contact_preferences, p.privacy_settings,
        us.posts_count, us.comments_count, us.questions_count,
        us.answers_count, us.connections_count, us.events_attended,
        us.last_active
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = $1
    `, [req.userId]);
    
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Parse JSON strings
    const parsedUser = {
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : [],
      education: user.education ? JSON.parse(user.education) : [],
      experience: user.experience ? JSON.parse(user.experience) : [],
      languages: user.languages ? JSON.parse(user.languages) : [],
      contact_preferences: user.contact_preferences ? JSON.parse(user.contact_preferences) : {},
      privacy_settings: user.privacy_settings ? JSON.parse(user.privacy_settings) : {}
    };

    res.json({
      success: true,
      user: {
        id: parsedUser.id,
        email: parsedUser.email,
        username: parsedUser.username,
        firstName: parsedUser.first_name,
        surname: parsedUser.surname,
        phone: parsedUser.phone,
        role: parsedUser.role,
        profilePicture: parsedUser.profile_picture,
        coverPhoto: parsedUser.cover_photo,
        isVerified: parsedUser.is_verified,
        isOnline: parsedUser.is_online,
        fullName: parsedUser.full_name,
        title: parsedUser.title,
        profession: parsedUser.profession,
        specialization: parsedUser.specialization,
        location: parsedUser.location,
        bio: parsedUser.bio,
        linkedin: parsedUser.linkedin,
        website: parsedUser.website,
        skills: parsedUser.skills,
        education: parsedUser.education,
        experience: parsedUser.experience,
        languages: parsedUser.languages,
        contactPreferences: parsedUser.contact_preferences,
        privacySettings: parsedUser.privacy_settings,
        stats: {
          posts: parsedUser.posts_count || 0,
          comments: parsedUser.comments_count || 0,
          questions: parsedUser.questions_count || 0,
          answers: parsedUser.answers_count || 0,
          connections: parsedUser.connections_count || 0,
          events: parsedUser.events_attended || 0
        },
        createdAt: parsedUser.created_at,
        lastActive: parsedUser.last_active
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user data', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout user (PostgreSQL version)
const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Update is_online status
    await query('UPDATE users SET is_online = $1 WHERE id = $2', [false, userId]);

    res.json({ success: true, message: 'Logout successful' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Logout failed', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Check availability (PostgreSQL version)
const checkAvailability = async (req, res) => {
  try {
    const { email, username } = req.query;

    if (!email && !username) {
      return res.status(400).json({ success: false, error: 'Email or username is required' });
    }

    let result = {};
    
    if (email) {
      const emailResult = await query('SELECT id FROM users WHERE email = $1', [email]);
      result.email = { available: emailResult.rows.length === 0 };
    }

    if (username) {
      const usernameResult = await query('SELECT id FROM users WHERE username = $1', [username]);
      result.username = { available: usernameResult.rows.length === 0 };
    }

    res.json({ success: true, ...result });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check availability', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  checkAvailability
};
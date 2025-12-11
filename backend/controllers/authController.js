const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { db } = require('../utils/db');

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
            return res.status(400).json({ 
                error: 'All required fields must be provided' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Please provide a valid email address' 
            });
        }

        // Validate username format (alphanumeric, underscores, hyphens)
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ 
                error: 'Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens' 
            });
        }

        // Validate password strength
        const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password.trim())) {
            return res.status(400).json({
                error:
                'Password must contain uppercase, lowercase, number and special character and be at least 8 characters long',
            });
        }


        // Check if user exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, email, username FROM users WHERE email = ? OR username = ?',
                [email, username],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({ 
                error: `User with this ${field} already exists`,
                field: field
            });
        }

        // Validate phone if provided
        const cleanPhone = phone.replace(/[^0-9+]/g, '');
        const phoneRegex = /^(?:\+?234|0)[789][01]\d{8}$/;
        if (!phoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                error: 'Please provide a valid Nigerian phone number',
            });
        }


        // Check terms agreement
        if (!agreeTerms) {
            return res.status(400).json({ 
                error: 'You must agree to the terms and conditions' 
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        let userId;
        try {
            // Start transaction
            await new Promise((resolve, reject) => {
                db.run('BEGIN TRANSACTION', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Insert user
            userId = await new Promise((resolve, reject) => {
                const sql = `
                    INSERT INTO users 
                    (email, username, password_hash, first_name, surname, phone, agree_terms) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                db.run(sql, [
                    email, 
                    username, 
                    hashedPassword, 
                    firstName, 
                    surname, 
                    phone || null, 
                    agreeTerms ? 1 : 0
                ], function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });

            // Create profile
            await new Promise((resolve, reject) => {
                const sql = `
                    INSERT INTO profiles (user_id, full_name, contact_preferences, privacy_settings) 
                    VALUES (?, ?, ?, ?)
                `;
                db.run(sql, [
                    userId, 
                    `${firstName} ${surname}`,
                    JSON.stringify({
                        email: true,
                        phone: phone ? true : false,
                        linkedin: false,
                        inPerson: false
                    }),
                    JSON.stringify({
                        profileVisibility: "members",
                        contactVisibility: "members",
                        activityVisibility: "public"
                    })
                ], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Create user stats
            await new Promise((resolve, reject) => {
                const sql = `
                    INSERT INTO user_stats (user_id) 
                    VALUES (?)
                `;
                db.run(sql, [userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Commit transaction
            await new Promise((resolve, reject) => {
                db.run('COMMIT', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

        } catch (error) {
            // Rollback on error
            await new Promise((resolve, reject) => {
                db.run('ROLLBACK', (err) => {
                    if (err) console.error('Rollback error:', err);
                    resolve();
                });
            });
            throw error;
        }

        // Generate token
        const token = generateToken(userId);

        // Get complete user data for response
        const newUser = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    u.id, u.email, u.username, u.first_name, u.surname, 
                    u.phone, u.profile_picture, u.role, u.created_at,
                    p.full_name, p.title, p.profession, p.specialization,
                    p.location, p.bio, p.linkedin, p.website,
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
        
        // Handle specific SQLite errors
        let errorMessage = 'Registration failed';
        if (error.code === 'SQLITE_CONSTRAINT') {
            if (error.message.includes('email')) {
                errorMessage = 'Email already exists';
            } else if (error.message.includes('username')) {
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

// Login user
const loginUser = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Validate required fields
        if (!emailOrUsername || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email/username and password are required' 
            });
        }

        // Find user by email or username with profile data
        const user = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    u.*,
                    p.full_name, p.title, p.profession, p.specialization,
                    p.location, p.bio, p.linkedin, p.website,
                    p.contact_preferences, p.privacy_settings,
                    us.posts_count, us.comments_count, us.questions_count,
                    us.answers_count, us.connections_count, us.events_attended,
                    us.last_active
                FROM users u
                LEFT JOIN profiles p ON u.id = p.user_id
                LEFT JOIN user_stats us ON u.id = us.user_id
                WHERE u.email = ? OR u.username = ?
            `, [emailOrUsername, emailOrUsername], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid email/username or password' 
            });
        }

        // Check if account is verified (if you implement email verification)
        if (user.is_verified === 0) {
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
            return res.status(401).json({ 
                success: false,
                error: 'Invalid email/username or password' 
            });
        }

        // Update is_online status
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET is_online = 1 WHERE id = ?',
                [user.id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Update last active
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE user_stats SET last_active = CURRENT_TIMESTAMP WHERE user_id = ?',
                [user.id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

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
                isVerified: parsedUser.is_verified === 1,
                isOnline: parsedUser.is_online === 1,
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

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    u.*,
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
            `, [req.userId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
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
                isVerified: parsedUser.is_verified === 1,
                isOnline: parsedUser.is_online === 1,
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

// Logout user (optional - for future implementation)
const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Update is_online status
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET is_online = 0 WHERE id = ?',
                [userId],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Logout failed', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Check if email/username is available
const checkAvailability = async (req, res) => {
    try {
        const { email, username } = req.query;

        if (!email && !username) {
            return res.status(400).json({ 
                success: false,
                error: 'Email or username is required' 
            });
        }

        let result = {};
        
        if (email) {
            const emailExists = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT id FROM users WHERE email = ?',
                    [email],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(!!row);
                    }
                );
            });
            result.email = { available: !emailExists };
        }

        if (username) {
            const usernameExists = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT id FROM users WHERE username = ?',
                    [username],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(!!row);
                    }
                );
            });
            result.username = { available: !usernameExists };
        }

        res.json({
            success: true,
            ...result
        });

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
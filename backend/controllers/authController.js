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

        // Check if user exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Insert user
        const userId = await new Promise((resolve, reject) => {
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
                phone, 
                agreeTerms ? 1 : 0
            ], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        // Create profile
        await new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO profiles (user_id, full_name) 
                VALUES (?, ?)
            `;
            db.run(sql, [
                userId, 
                `${firstName} ${surname}`
            ], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Generate token
        const token = generateToken(userId);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: userId,
                email,
                username,
                firstName,
                surname,
                phone
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Registration failed', 
            details: error.message 
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Find user by email or username
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE email = ? OR username = ?',
                [emailOrUsername, emailOrUsername],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }

        // Generate token
        const token = generateToken(user.id);

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

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.first_name,
                surname: user.surname,
                phone: user.phone,
                role: user.role,
                profilePicture: user.profile_picture
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed', 
            details: error.message 
        });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, email, username, first_name, surname, phone, role, profile_picture FROM users WHERE id = ?',
                [req.userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch user', 
            details: error.message 
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};
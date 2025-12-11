
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        { expiresIn: '7d' }
    );
};

// Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Verify token middleware

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

        console.log('🔹 JWT decoded payload:', decoded);
        req.userId = decoded.userId; // <-- Must match your token payload
        next();
    });
};


module.exports = {
    generateToken,
    hashPassword,
    comparePassword,
    verifyToken
};
// ========================
// SECTION 1: IMPORTS (ONCE)
// ========================
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Import database
require('./database/init');
const { db } = require('./utils/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const communityRoutes = require('./routes/communityRoutes');
const qandaRoutes = require('./routes/qandaRoutes');

// ========================
// SECTION 2: APP SETUP (ONCE)
// ========================
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// ========================
// SECTION 3: ROUTES (Order matters!)
// ========================

// 1. Home route (simplest, should be first)
app.get('/', (req, res) => {
    res.json({ 
        message: 'Ojoto Union NA Backend API',
        status: 'running',
        version: '1.0.0',
        endpoints: {
            home: 'GET /',
            health: 'GET /api/health',
            test_db: 'GET /api/test-db',
            users: 'GET /api/users',
            auth_test: 'GET /api/auth/test',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login'
        }
    });
});

// 2. Auth routes (all routes starting with /api/auth)
app.use('/api/auth', authRoutes);

// 3. API routes
app.get('/api/health', async (req, res) => {
    try {
        const result = await new Promise((resolve, reject) => {
            db.get("SELECT datetime('now') as current_time, 'SQLite' as database", (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        res.json({
            status: 'healthy',
            message: 'API and database are running',
            timestamp: result.current_time,
            database: result.database,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

//4. API route

app.use('/api/profile', profileRoutes);

app.get('/api/users', async (req, res) => {
    try {
        const users = await new Promise((resolve, reject) => {
            db.all("SELECT id, email, username, first_name, surname, phone, created_at FROM users ORDER BY created_at DESC", (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

app.get('/api/test-db', async (req, res) => {
    try {
        const testEmail = `test${Date.now()}@example.com`;
        const testUsername = `testuser${Date.now()}`;
        
        const userResult = await new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO users (email, username, password_hash, first_name, surname, phone, agree_terms) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(sql, [
                testEmail, 
                testUsername, 
                'hashed_password', 
                'Test',
                'User',
                '+1234567890',
                1
            ], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
        
        await new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO profiles (user_id, full_name, title, profession, location, bio) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.run(sql, [
                userResult,
                'Test User',
                'Software Developer',
                'Software Engineer',
                'New York, USA',
                'This is a test user profile'
            ], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        res.json({
            success: true,
            message: 'Test user and profile created successfully',
            userId: userResult,
            testEmail,
            testUsername
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to insert test data',
            error: error.message
        });
    }
});

app.use('/api/community', communityRoutes);
// Add after community routes

app.use('/api/qanda', qandaRoutes);

// ========================
// SECTION 4: ERROR HANDLERS (MUST BE LAST)
// ========================

// 404 Handler - catches any route not defined above
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        available_routes: [
            '/',
            '/api/health',
            '/api/test-db', 
            '/api/users',
            '/api/auth/test',
            '/api/auth/register',
            '/api/auth/login',
            '/api/auth/me'
        ]
    });
});

// Global error handler - catches all errors
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ========================
// SECTION 5: START SERVERA
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test database: http://localhost:${PORT}/api/test-db`);
    console.log(`👥 List users: http://localhost:${PORT}/api/users`);
    console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
});
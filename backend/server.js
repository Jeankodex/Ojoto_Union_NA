// server.js

// SECTION 1: IMPORTS

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Import database pool and query helper
const { pool, query } = require('./database/init');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const communityRoutes = require('./routes/communityRoutes');
const qandaRoutes = require('./routes/qandaRoutes');
const uploadRoutes = require('./routes/upload');
const volunteerRoutes = require('./routes/volunteerRoutes');

// ========================
// SECTION 2: APP SETUP
// ========================
const app = express();

// CORS: Allow localhost for dev, Vercel for production
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// SECTION 3: ROUTES
// ========================

// Home route
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

// Auth routes
app.use('/api/auth', authRoutes);

// Health check (PostgreSQL version)
app.get('/api/health', async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    const result = await pool.query("SELECT NOW() as current_time, 'PostgreSQL' as database");
    
    console.log('✅ DB query successful:', result.rows[0]);
    
    res.json({
      status: 'healthy',
      message: 'API and database are running',
      timestamp: result.rows[0].current_time,
      database: result.rows[0].database,
      uptime: process.uptime()
    });
  } catch (error) {
    // 🔥 LOG FULL ERROR DETAILS TO CONSOLE
    console.error('❌ HEALTH CHECK FAILED:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      stack: error.stack
    });
    
    res.status(500).json({
      status: 'unhealthy',
      message: 'Database connection failed',
      error: error.message,
      code: error.code,
      detail: error.detail
    });
  }
});

// Profile & upload routes
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);

// List users (PostgreSQL version)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, username, first_name, surname, phone, created_at FROM users ORDER BY created_at DESC"
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Test DB insert (PostgreSQL version with $ placeholders)
app.get('/api/test-db', async (req, res) => {
  try {
    const testEmail = `test${Date.now()}@example.com`;
    const testUsername = `testuser${Date.now()}`;
    
    // Insert user with RETURNING to get the new ID
    const userResult = await pool.query(
      `INSERT INTO users (email, username, password_hash, first_name, surname, phone, agree_terms) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [testEmail, testUsername, 'hashed_password', 'Test', 'User', '+1234567890', true]
    );
    const userId = userResult.rows[0].id;
    
    // Insert profile
    await pool.query(
      `INSERT INTO profiles (user_id, full_name, title, profession, location, bio) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'Test User', 'Software Developer', 'Software Engineer', 'New York, USA', 'This is a test user profile']
    );
    
    res.json({
      success: true,
      message: 'Test user and profile created successfully',
      userId,
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

// Community & Q&A routes
app.use('/api/community', communityRoutes);
app.use('/api/qanda', qandaRoutes);
app.use('/api/volunteer', volunteerRoutes);

// ========================
// SECTION 4: ERROR HANDLERS (MUST BE LAST)
// ========================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    available_routes: [
      '/', '/api/health', '/api/test-db', '/api/users',
      '/api/auth/test', '/api/auth/register', '/api/auth/login', '/api/auth/me'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========================
// SECTION 5: START SERVER
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
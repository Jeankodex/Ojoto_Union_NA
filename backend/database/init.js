// database/init.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.connect((err) => {
  if (err) console.error('❌ DB connection error FULL:', err);
  else console.log('✅ Connected to PostgreSQL');
});

// Initialize all tables (PostgreSQL syntax)
async function initializeTables() {
  console.log('📊 Initializing database tables...');
  
  const queries = [
    // 1. USERS TABLE
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      surname TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'member',
      is_verified BOOLEAN DEFAULT TRUE,
      is_online BOOLEAN DEFAULT FALSE,
      agree_terms BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // 2. PROFILES TABLE
    `CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      full_name TEXT,
      title TEXT,
      profession TEXT,
      specialization TEXT,
      location TEXT,
      bio TEXT,
      linkedin TEXT,
      website TEXT,
      profile_picture TEXT DEFAULT 'default.png',
      cover_photo TEXT DEFAULT 'default-cover.jpg',
      skills JSONB DEFAULT '[]'::jsonb,
      education JSONB DEFAULT '[]'::jsonb,
      experience JSONB DEFAULT '[]'::jsonb,
      languages JSONB DEFAULT '[]'::jsonb,
      contact_preferences JSONB DEFAULT '{"email": true, "phone": true, "linkedin": true, "inPerson": true}'::jsonb,
      privacy_settings JSONB DEFAULT '{"profileVisibility": "public", "contactVisibility": "members", "activityVisibility": "public"}'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // 3. COMMUNITY POSTS
    `CREATE TABLE IF NOT EXISTS community_posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      tags JSONB DEFAULT '[]'::jsonb,
      attachments JSONB DEFAULT '[]'::jsonb,
      is_pinned BOOLEAN DEFAULT FALSE,
      is_urgent BOOLEAN DEFAULT FALSE,
      likes INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // 4. COMMENTS
    `CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // 5. QUESTIONS
    `CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      is_urgent BOOLEAN DEFAULT FALSE,
      is_resolved BOOLEAN DEFAULT FALSE,
      views INTEGER DEFAULT 0,
      answers_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // 6. ANSWERS
    `CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      is_helpful BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // 7. VOLUNTEER OPPORTUNITIES
    `CREATE TABLE IF NOT EXISTS volunteer_opportunities (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      time_commitment TEXT,
      skills_needed TEXT,
      requirements TEXT,
      is_urgent BOOLEAN DEFAULT FALSE,
      contact_email TEXT,
      contact_phone TEXT,
      date DATE NOT NULL,
      slots INTEGER DEFAULT 1,
      status TEXT DEFAULT 'open',
      signups_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // 8. VOLUNTEER SIGNUPS
    `CREATE TABLE IF NOT EXISTS volunteer_signups (
      id SERIAL PRIMARY KEY,
      opportunity_id INTEGER NOT NULL REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      skills TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(opportunity_id, user_id)
    )`,
    
    // 9. CONNECTIONS
    `CREATE TABLE IF NOT EXISTS connections (
      id SERIAL PRIMARY KEY,
      user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user1_id, user2_id)
    )`,
    
    // 10. USER STATS
    `CREATE TABLE IF NOT EXISTS user_stats (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      posts_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      questions_count INTEGER DEFAULT 0,
      answers_count INTEGER DEFAULT 0,
      connections_count INTEGER DEFAULT 0,
      events_attended INTEGER DEFAULT 0,
      last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  // Execute all table creations
  for (let i = 0; i < queries.length; i++) {
    try {
      await pool.query(queries[i]);
      console.log(`✅ Table ${i + 1}/${queries.length} ready`);
    } catch (err) {
      console.error(`❌ Error creating table ${i + 1}:`, err.message);
    }
  }
  
  console.log('🎉 All tables initialized!');
  await createIndexes(); // Run indexes after tables exist
}

// Create indexes for performance
async function createIndexes() {
  console.log('📈 Creating indexes...');
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
    'CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category)',
    'CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id)',
    'CREATE INDEX IF NOT EXISTS idx_questions_user ON questions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id)',
    'CREATE INDEX IF NOT EXISTS idx_connections_user1 ON connections(user1_id)',
    'CREATE INDEX IF NOT EXISTS idx_volunteer_user ON volunteer_opportunities(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_volunteer_signups_opp ON volunteer_signups(opportunity_id)'
  ];

  for (const sql of indexes) {
    try {
      await pool.query(sql);
    } catch (err) {
      console.error('❌ Index error:', err.message);
    }
  }
  console.log('✅ Indexes created');
}

// Run initialization (only once on startup)
initializeTables().catch(console.error);

// Export pool and helper for queries
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};
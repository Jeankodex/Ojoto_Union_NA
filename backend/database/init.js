
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'database.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeTables();
    }
});

// Function to initialize all tables
function initializeTables() {
    console.log('📊 Initializing database tables...');
    
    // 1. USERS TABLE (Registration fields)
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT NOT NULL,
            surname TEXT NOT NULL,
            phone TEXT,
            profile_picture TEXT DEFAULT 'default.png',
            role TEXT DEFAULT 'member',
            is_verified BOOLEAN DEFAULT 0,
            is_online BOOLEAN DEFAULT 0,
            agree_terms BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // 2. PROFILES TABLE (EditProfile.jsx fields)
    const createProfilesTable = `
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            full_name TEXT,
            title TEXT,
            profession TEXT,
            specialization TEXT,
            location TEXT,
            bio TEXT,
            linkedin TEXT,
            website TEXT,
            skills TEXT DEFAULT '[]',
            education TEXT DEFAULT '[]',
            experience TEXT DEFAULT '[]',
            languages TEXT DEFAULT '[]',
            contact_preferences TEXT DEFAULT '{"email": true, "phone": true, "linkedin": true, "inPerson": true}',
            privacy_settings TEXT DEFAULT '{"profileVisibility": "public", "contactVisibility": "members", "activityVisibility": "public"}',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    // 3. COMMUNITY POSTS (CreatePost.jsx fields)
    const createCommunityPostsTable = `
        CREATE TABLE IF NOT EXISTS community_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'general',
            tags TEXT DEFAULT '[]',
            attachments TEXT DEFAULT '[]',
            is_pinned BOOLEAN DEFAULT 0,
            is_urgent BOOLEAN DEFAULT 0,
            likes INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    // 4. COMMENTS (Community.jsx)
    const createCommentsTable = `
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    // 5. QUESTIONS (Questions.jsx)
    const createQuestionsTable = `
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'general',
            is_urgent BOOLEAN DEFAULT 0,
            is_resolved BOOLEAN DEFAULT 0,
            views INTEGER DEFAULT 0,
            answers_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    // 6. ANSWERS (Questions.jsx)
    const createAnswersTable = `
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            is_helpful BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    // 7. VOLUNTEER OPPORTUNITIES (Future - Volunteer.jsx)
    const createVolunteerOpportunitiesTable = `
        CREATE TABLE IF NOT EXISTS volunteer_opportunities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            date DATE NOT NULL,
            slots INTEGER DEFAULT 1,
            requirements TEXT,
            status TEXT DEFAULT 'open',
            signups_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    // 8. VOLUNTEER SIGNUPS
    const createVolunteerSignupsTable = `
        CREATE TABLE IF NOT EXISTS volunteer_signups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            opportunity_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            message TEXT,
            signed_up_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (opportunity_id) REFERENCES volunteer_opportunities(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(opportunity_id, user_id)
        )
    `;
    
    // 9. CONNECTIONS (Members.jsx networking)
    const createConnectionsTable = `
        CREATE TABLE IF NOT EXISTS connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user1_id INTEGER NOT NULL,
            user2_id INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user1_id, user2_id)
        )
    `;
    
    // 10. USER STATS (for MemberDetail.jsx)
    const createUserStatsTable = `
        CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            posts_count INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            questions_count INTEGER DEFAULT 0,
            answers_count INTEGER DEFAULT 0,
            connections_count INTEGER DEFAULT 0,
            events_attended INTEGER DEFAULT 0,
            last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    // Execute all table creation
    const tables = [
        { name: 'users', sql: createUsersTable },
        { name: 'profiles', sql: createProfilesTable },
        { name: 'community_posts', sql: createCommunityPostsTable },
        { name: 'comments', sql: createCommentsTable },
        { name: 'questions', sql: createQuestionsTable },
        { name: 'answers', sql: createAnswersTable },
        { name: 'volunteer_opportunities', sql: createVolunteerOpportunitiesTable },
        { name: 'volunteer_signups', sql: createVolunteerSignupsTable },
        { name: 'connections', sql: createConnectionsTable },
        { name: 'user_stats', sql: createUserStatsTable }
    ];
    
    let completed = 0;
    
    tables.forEach(table => {
        db.run(table.sql, (err) => {
            if (err) {
                console.error(`❌ Error creating ${table.name} table:`, err.message);
            } else {
                console.log(`✅ ${table.name} table ready`);
                completed++;
                
                if (completed === tables.length) {
                    console.log('🎉 All database tables initialized successfully!');
                    createTriggersAndIndexes();
                }
            }
        });
    });
}

// Create triggers and indexes
function createTriggersAndIndexes() {
    console.log('⚙️ Creating triggers and indexes...');
    
    // Triggers for automatic counts
    const triggers = [
        // Update comments count when comment is added/deleted
        `CREATE TRIGGER IF NOT EXISTS update_post_comments_count 
         AFTER INSERT ON comments
         BEGIN
             UPDATE community_posts 
             SET comments_count = comments_count + 1 
             WHERE id = NEW.post_id;
         END`,
        
        `CREATE TRIGGER IF NOT EXISTS decrease_post_comments_count 
         AFTER DELETE ON comments
         BEGIN
             UPDATE community_posts 
             SET comments_count = comments_count - 1 
             WHERE id = OLD.post_id;
         END`,
        
        // Update answers count
        `CREATE TRIGGER IF NOT EXISTS update_question_answers_count 
         AFTER INSERT ON answers
         BEGIN
             UPDATE questions 
             SET answers_count = answers_count + 1 
             WHERE id = NEW.question_id;
         END`,
        
        `CREATE TRIGGER IF NOT EXISTS decrease_question_answers_count 
         AFTER DELETE ON answers
         BEGIN
             UPDATE questions 
             SET answers_count = answers_count - 1 
             WHERE id = OLD.question_id;
         END`,
        
        // Update user stats
        `CREATE TRIGGER IF NOT EXISTS update_user_stats_on_post 
         AFTER INSERT ON community_posts
         BEGIN
             INSERT OR IGNORE INTO user_stats (user_id) VALUES (NEW.user_id);
             UPDATE user_stats SET posts_count = posts_count + 1 WHERE user_id = NEW.user_id;
         END`,
        
        `CREATE TRIGGER IF NOT EXISTS update_user_stats_on_comment 
         AFTER INSERT ON comments
         BEGIN
             INSERT OR IGNORE INTO user_stats (user_id) VALUES (NEW.user_id);
             UPDATE user_stats SET comments_count = comments_count + 1 WHERE user_id = NEW.user_id;
         END`,
        
        `CREATE TRIGGER IF NOT EXISTS update_user_stats_on_question 
         AFTER INSERT ON questions
         BEGIN
             INSERT OR IGNORE INTO user_stats (user_id) VALUES (NEW.user_id);
             UPDATE user_stats SET questions_count = questions_count + 1 WHERE user_id = NEW.user_id;
         END`,
        
        `CREATE TRIGGER IF NOT EXISTS update_user_stats_on_answer 
         AFTER INSERT ON answers
         BEGIN
             INSERT OR IGNORE INTO user_stats (user_id) VALUES (NEW.user_id);
             UPDATE user_stats SET answers_count = answers_count + 1 WHERE user_id = NEW.user_id;
         END`
    ];
    
    // Indexes for better performance
    const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
        'CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_posts_user ON community_posts(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category)',
        'CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC)',
        'CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id)',
        'CREATE INDEX IF NOT EXISTS idx_questions_user ON questions(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category)',
        'CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id)',
        'CREATE INDEX IF NOT EXISTS idx_connections_user1 ON connections(user1_id)',
        'CREATE INDEX IF NOT EXISTS idx_connections_user2 ON connections(user2_id)'
    ];
    
    // Execute triggers
    triggers.forEach((trigger, index) => {
        db.run(trigger, (err) => {
            if (err) {
                console.error(`❌ Error creating trigger ${index + 1}:`, err.message);
            }
        });
    });
    
    // Execute indexes
    indexes.forEach((sql, index) => {
        db.run(sql, (err) => {
            if (err) {
                console.error(`❌ Error creating index ${index + 1}:`, err.message);
            }
        });
    });
    
    console.log('📈 Database triggers and indexes created');
}

// Export the database connection
module.exports = db;
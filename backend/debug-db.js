
// debug-db.js - Minimal connection test
require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Testing Supabase connection...\n');

// Show connection string (with password hidden)
const safeUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')
  : 'NOT SET';
console.log('DATABASE_URL:', safeUrl, '\n');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  }
});

async function test() {
  try {
    console.log('1️⃣ Connecting to database...');
    const client = await pool.connect();
    console.log('✅ Connected!\n');

    console.log('2️⃣ Running test query...');
    const result = await client.query('SELECT NOW() as time, version() as pg_version');
    console.log('✅ Query result:');
    console.log('   Time:', result.rows[0].time);
    console.log('   PostgreSQL Version:', result.rows[0].pg_version.substring(0, 50) + '...\n');

    console.log('3️⃣ Checking if "users" table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log('✅ Users table exists:', tableCheck.rows[0].exists, '\n');

    console.log('🎉 ALL TESTS PASSED! Your connection is working.');
    
    client.release();
  } catch (err) {
    console.error('❌ TEST FAILED - Full error details:');
    console.error('   Message:', err.message);
    console.error('   Code:', err.code);
    console.error('   Detail:', err.detail);
    console.error('   Hint:', err.hint);
    console.error('   Stack:', err.stack?.split('\n')[1]?.trim());
  } finally {
    await pool.end();
    console.log('\n🔚 Test complete.');
  }
}

test();
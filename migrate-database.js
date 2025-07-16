#!/usr/bin/env node

const fs = require('fs');
const { Client } = require('pg');

// Database configuration
const config = {
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.swhkbukgkafoqyvljmrd',
  password: process.env.SUPABASE_DB_PASSWORD || '',
  ssl: { rejectUnauthorized: false }
};

async function executeMigration() {
  const client = new Client(config);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Step 1: Drop all existing tables
    console.log('🗑️  Dropping all existing tables...');
    const dropScript = fs.readFileSync('./drop-all-tables.sql', 'utf8');
    await client.query(dropScript);
    console.log('✅ All tables dropped successfully!');

    // Step 2: Create new schema
    console.log('🏗️  Creating new simplified schema...');
    const schemaScript = fs.readFileSync('./schema-new-simplified.sql', 'utf8');
    await client.query(schemaScript);
    console.log('✅ New schema created successfully!');

    // Step 3: Verify migration
    console.log('🔍 Verifying migration...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables created:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // Verify admin user exists
    const adminCheck = await client.query("SELECT username, role FROM users WHERE role = 'super_admin'");
    if (adminCheck.rows.length > 0) {
      console.log('👤 Admin user verified:', adminCheck.rows[0].username);
    }

    // Check system settings
    const settingsCheck = await client.query("SELECT COUNT(*) as count FROM system_settings");
    console.log('⚙️  System settings created:', settingsCheck.rows[0].count);

    console.log('');
    console.log('🎉 Database migration completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Update API endpoints for new schema');
    console.log('   2. Update frontend components');
    console.log('   3. Test all functionality');
    console.log('');
    console.log('🔑 Default admin credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

// Check if password is provided
if (!process.env.SUPABASE_DB_PASSWORD) {
  console.error('❌ Database password is required!');
  console.error('');
  console.error('Please set the environment variable:');
  console.error('export SUPABASE_DB_PASSWORD="your_database_password"');
  console.error('');
  console.error('You can find the password in your Supabase dashboard:');
  console.error('1. Go to https://supabase.com/dashboard');
  console.error('2. Select your project');
  console.error('3. Go to Settings > Database');
  console.error('4. Copy the password from Connection string');
  process.exit(1);
}

// Execute migration
executeMigration();
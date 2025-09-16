const { createClient } = require('@supabase/supabase-js');

// Test database connection and check if user roles exist
async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Use the public URL and anon key for basic connection test
    const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkZGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NzQ4NzEsImV4cCI6MjA1MjU1MDg3MX0.8QZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    console.log('📡 Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('roles')
      .select('name, hierarchy_level')
      .limit(5);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      return;
    }
    
    console.log('✅ Database connection successful');
    console.log('📋 Current roles in database:');
    testData.forEach(role => {
      console.log(`  - ${role.name} (level ${role.hierarchy_level})`);
    });
    
    // Check if our user types exist
    const userTypes = ['fan', 'performer', 'venue_manager', 'influencer', 'admin'];
    const existingTypes = testData.map(r => r.name);
    const missingTypes = userTypes.filter(type => !existingTypes.includes(type));
    
    if (missingTypes.length > 0) {
      console.log('❌ Missing user types:', missingTypes);
    } else {
      console.log('✅ All user types found in database');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDatabaseConnection();


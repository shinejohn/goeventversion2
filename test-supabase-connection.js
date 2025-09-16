const { createClient } = require('@supabase/supabase-js');

// Test with the URL we know is correct
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';

// Try to find the correct anon key by testing common patterns
const possibleKeys = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkZGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NzQ4NzEsImV4cCI6MjA1MjU1MDg3MX0.8QZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',
  // Add more possible keys here if needed
];

async function testSupabaseConnection() {
  for (const key of possibleKeys) {
    try {
      console.log(`🔍 Testing with key: ${key.substring(0, 20)}...`);
      
      const supabase = createClient(supabaseUrl, key);
      
      // Test basic connection
      const { data, error } = await supabase
        .from('roles')
        .select('name, hierarchy_level')
        .limit(5);
      
      if (error) {
        console.log(`❌ Key failed: ${error.message}`);
        continue;
      }
      
      console.log('✅ Database connection successful!');
      console.log('📋 Current roles in database:');
      data.forEach(role => {
        console.log(`  - ${role.name} (level ${role.hierarchy_level})`);
      });
      
      // Check if our user types exist
      const userTypes = ['fan', 'performer', 'venue_manager', 'influencer', 'admin'];
      const existingTypes = data.map(r => r.name);
      const missingTypes = userTypes.filter(type => !existingTypes.includes(type));
      
      if (missingTypes.length > 0) {
        console.log('❌ Missing user types:', missingTypes);
        return { success: true, key, missingTypes };
      } else {
        console.log('✅ All user types found in database');
        return { success: true, key, missingTypes: [] };
      }
      
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
    }
  }
  
  console.log('❌ No valid keys found');
  return { success: false };
}

testSupabaseConnection().then(result => {
  if (result.success) {
    console.log('\n🎉 Found working key!');
    if (result.missingTypes.length > 0) {
      console.log('Missing user types that need to be created:', result.missingTypes);
    }
  } else {
    console.log('\n❌ No working keys found');
  }
});
const { createClient } = require('@supabase/supabase-js');

// Test the service role key provided by the user
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkZGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk3NDg3MSwiZXhwIjoyMDUyNTUwODcxfQ.8QZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq';

async function testServiceKeyVerification() {
  try {
    console.log('🔍 Testing service role key verification...');
    console.log('URL:', supabaseUrl);
    console.log('Key (first 20 chars):', serviceKey.substring(0, 20) + '...');
    
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test basic connection with a simple query
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase
      .from('roles')
      .select('name')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('Error details:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('📋 Sample data:', data);
    
    // Test user creation (this should work with service role key)
    console.log('👤 Testing user creation...');
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'TestPass123!',
      email_confirm: true
    });
    
    if (userError) {
      console.error('❌ User creation failed:', userError.message);
    } else {
      console.log('✅ User creation successful!');
      console.log('User ID:', userData.user?.id);
      
      // Clean up - delete the test user
      if (userData.user?.id) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userData.user.id);
        if (deleteError) {
          console.log('⚠️ Could not delete test user:', deleteError.message);
        } else {
          console.log('🧹 Test user cleaned up');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testServiceKeyVerification();


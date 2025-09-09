const { createClient } = require('@supabase/supabase-js');

// Use the production values from your .env
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can query the events table
    console.log('\n1. Testing events table:');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(5);
    
    if (eventsError) {
      console.error('Events error:', eventsError);
    } else {
      console.log('Events found:', events?.length || 0);
    }

    // Test 2: Check venues
    console.log('\n2. Testing venues table:');
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('*')
      .limit(5);
    
    if (venuesError) {
      console.error('Venues error:', venuesError);
    } else {
      console.log('Venues found:', venues?.length || 0);
    }

    // Test 3: Check accounts (might fail due to RLS)
    console.log('\n3. Testing accounts table (might fail due to RLS):');
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .limit(5);
    
    if (accountsError) {
      console.error('Accounts error (expected if RLS is enabled):', accountsError);
    } else {
      console.log('Accounts found:', accounts?.length || 0);
    }

    // Test 4: Check auth
    console.log('\n4. Testing auth:');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth error (expected with anon key):', authError);
    } else {
      console.log('Users found:', users?.length || 0);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
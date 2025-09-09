// Direct Supabase API test - bypassing React Router 7 and Vite
const SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

console.log('Testing direct Supabase API connection...\n');

// Function to fetch data from Supabase REST API
async function fetchFromSupabase(table, query = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
  console.log(`Fetching from: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

// Test all the tables
async function testSupabaseConnection() {
  console.log('=== TESTING SUPABASE CONNECTION ===\n');
  
  // 1. Test Events table
  console.log('1. FETCHING EVENTS:');
  const events = await fetchFromSupabase('events', '?limit=5&order=created_at.desc');
  if (events.error) {
    console.log('❌ Error:', events.error);
  } else {
    console.log(`✅ Found ${events.data.length} events`);
    if (events.data.length > 0) {
      console.log('First event:', JSON.stringify(events.data[0], null, 2));
    }
  }
  
  console.log('\n2. FETCHING VENUES:');
  const venues = await fetchFromSupabase('venues', '?limit=5&order=created_at.desc');
  if (venues.error) {
    console.log('❌ Error:', venues.error);
  } else {
    console.log(`✅ Found ${venues.data.length} venues`);
    if (venues.data.length > 0) {
      console.log('First venue:', JSON.stringify(venues.data[0], null, 2));
    }
  }
  
  console.log('\n3. FETCHING PERFORMERS:');
  const performers = await fetchFromSupabase('performers', '?limit=5&order=created_at.desc');
  if (performers.error) {
    console.log('❌ Error:', performers.error);
  } else {
    console.log(`✅ Found ${performers.data.length} performers`);
    if (performers.data.length > 0) {
      console.log('First performer:', JSON.stringify(performers.data[0], null, 2));
    }
  }
  
  console.log('\n4. FETCHING ACCOUNTS:');
  const accounts = await fetchFromSupabase('accounts', '?limit=5&order=created_at.desc');
  if (accounts.error) {
    console.log('❌ Error:', accounts.error);
  } else {
    console.log(`✅ Found ${accounts.data.length} accounts`);
    if (accounts.data.length > 0) {
      console.log('First account (name only):', accounts.data[0].name);
    }
  }
  
  console.log('\n5. TESTING AUTH - Getting current user:');
  // This will likely return null for anon user
  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  
  if (authResponse.ok) {
    const user = await authResponse.json();
    console.log('Current user:', user);
  } else {
    console.log('No authenticated user (expected for anon key)');
  }
  
  console.log('\n=== TEST COMPLETE ===');
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`- Supabase URL: ${SUPABASE_URL}`);
  console.log(`- Connection: ${events.error ? '❌ FAILED' : '✅ SUCCESS'}`);
  console.log(`- Events table: ${events.error ? '❌' : '✅'} ${events.data?.length || 0} records`);
  console.log(`- Venues table: ${venues.error ? '❌' : '✅'} ${venues.data?.length || 0} records`);
  console.log(`- Performers table: ${performers.error ? '❌' : '✅'} ${performers.data?.length || 0} records`);
  console.log(`- RLS Status: ${events.error ? 'Unknown' : 'Accessible with anon key (RLS disabled or permissive)'}`);
}

// Run the test
testSupabaseConnection().catch(console.error);
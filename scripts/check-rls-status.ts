import { createClient } from '@supabase/supabase-js';

// Production credentials
const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_SERVICE_ROLE_KEY);

async function checkRLSAndTestQueries() {
  console.log('🔍 Checking RLS status and testing queries...\n');
  
  // Test event queries like the detail page does
  console.log('📋 Testing event detail query (like events/$id.tsx)...');
  
  // Pick a known event ID
  const eventId = '99726dc7-24e4-4223-87e9-6c69adcd9237';
  
  // Try the same query pattern as the detail page
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select(`
      *,
      venues!venue_id (
        id,
        name,
        address,
        city,
        state
      )
    `)
    .eq('id', eventId)
    .single();
    
  if (eventError) {
    console.error('❌ Event query failed:', eventError);
  } else {
    console.log('✅ Event query succeeded:');
    console.log('   Event:', event?.title);
    console.log('   Venue:', event?.venues);
  }
  
  // Test with anon key to simulate production
  console.log('\n🔐 Testing with ANON key (simulating production)...');
  const anonClient = createClient(
    PRODUCTION_SUPABASE_URL, 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI'
  );
  
  const { data: anonEvent, error: anonError } = await anonClient
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
    
  if (anonError) {
    console.error('❌ Anon query failed:', anonError);
  } else {
    console.log('✅ Anon query succeeded:');
    console.log('   Event:', anonEvent?.title);
  }
  
  // Check RLS status on key tables
  console.log('\n🛡️ Checking RLS policies...');
  
  // This would need direct database access, but we can infer from query results
  console.log('Based on query results:');
  console.log('- Events table:', anonEvent ? 'RLS disabled or has public read policy' : 'RLS might be blocking reads');
  
  // Test venue query
  const { data: venues, error: venueError } = await anonClient
    .from('venues')
    .select('*')
    .limit(1);
    
  console.log('- Venues table:', venues && venues.length > 0 ? 'Accessible' : 'Not accessible');
  
  // Test performers
  const { data: performers, error: performerError } = await anonClient
    .from('performers')
    .select('*')
    .limit(1);
    
  console.log('- Performers table:', performers && performers.length > 0 ? 'Accessible' : 'Not accessible');
}

checkRLSAndTestQueries()
  .then(() => console.log('\n✅ Check completed'))
  .catch(error => console.error('\n❌ Script failed:', error));
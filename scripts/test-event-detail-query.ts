import { createClient } from '@supabase/supabase-js';

const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const client = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_ANON_KEY);

async function testEventDetailQuery() {
  const eventId = '99726dc7-24e4-4223-87e9-6c69adcd9237';
  
  console.log('🔍 Testing event detail page query...\n');
  
  // First, test the exact query from the detail page
  console.log('1️⃣ Testing EXACT query from events/$id.tsx (with all fields):');
  const { data: fullQuery, error: fullError } = await client
    .from('events')
    .select(`
      *,
      venues!venue_id (
        id,
        name,
        address,
        city,
        state,
        latitude,
        longitude,
        max_capacity,
        amenities,
        profile_image_url,
        base_hourly_rate,
        description,
        is_verified,
        parking_info,
        transit_options,
        nearby_amenities
      )
    `)
    .eq('id', eventId)
    .single();
    
  if (fullError) {
    console.error('❌ Full query FAILED:', fullError.message);
  } else {
    console.log('✅ Full query succeeded');
  }
  
  // Now test a simplified query
  console.log('\n2️⃣ Testing SIMPLIFIED query (only fields that exist):');
  const { data: simpleQuery, error: simpleError } = await client
    .from('events')
    .select(`
      *,
      venues!venue_id (
        id,
        name,
        address,
        city,
        state,
        max_capacity,
        image_url,
        description,
        is_active
      )
    `)
    .eq('id', eventId)
    .single();
    
  if (simpleError) {
    console.error('❌ Simple query failed:', simpleError.message);
  } else {
    console.log('✅ Simple query succeeded');
    console.log('   Event:', simpleQuery.title);
    console.log('   Venue:', simpleQuery.venues?.name);
  }
  
  // Test what fields actually exist in venues table
  console.log('\n3️⃣ Checking what fields exist in venues table:');
  const { data: venue, error: venueError } = await client
    .from('venues')
    .select('*')
    .limit(1)
    .single();
    
  if (!venueError && venue) {
    console.log('✅ Available venue fields:', Object.keys(venue).join(', '));
  }
}

testEventDetailQuery()
  .then(() => console.log('\n✅ Test completed'))
  .catch(console.error);
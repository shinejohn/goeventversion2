import { createClient } from '@supabase/supabase-js';

const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const client = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_ANON_KEY);

async function testVenueDetailQuery() {
  const venueId = '2f12db95-e5e7-4f90-a9ff-abf2035b1c87'; // A known venue ID
  
  console.log('🔍 Testing venue detail page query...\n');
  
  // First check what fields a venue has
  console.log('1️⃣ Getting actual venue fields:');
  const { data: sampleVenue, error: sampleError } = await client
    .from('venues')
    .select('*')
    .eq('id', venueId)
    .single();
    
  if (!sampleError && sampleVenue) {
    console.log('✅ Venue fields:', Object.keys(sampleVenue).sort().join(', '));
    console.log('\nVenue data sample:');
    console.log('- name:', sampleVenue.name);
    console.log('- venue_type:', sampleVenue.venue_type);
    console.log('- max_capacity:', sampleVenue.max_capacity);
    console.log('- pricePerHour:', sampleVenue.pricePerHour);
  }
  
  // Test problematic fields from venues/$venueId.tsx
  console.log('\n2️⃣ Testing problematic fields from venues/$venueId.tsx:');
  const problemFields = [
    'profile_image_url', // line 80 in performers query
    'latitude',  // line 259 in meta tags
    'longitude', // line 260 in meta tags
    'base_hourly_rate', // line 160
    'parking_info', // line 150
    'transit_options', // line 156
    'nearby_amenities', // line 146
    'capacity', // used in multiple places, but table has max_capacity
    'rating' // line 187
  ];
  
  for (const field of problemFields) {
    const hasField = sampleVenue && field in sampleVenue;
    console.log(`- ${field}: ${hasField ? '✅ EXISTS' : '❌ MISSING'}`);
  }
  
  // Show correct field mappings
  console.log('\n3️⃣ Correct field mappings:');
  console.log('❌ profile_image_url → ✅ image_url');
  console.log('❌ capacity → ✅ max_capacity');
  console.log('❌ latitude/longitude → ✅ location_data (JSON) or separate city/state');
  console.log('❌ base_hourly_rate → ✅ pricePerHour');
}

testVenueDetailQuery()
  .then(() => console.log('\n✅ Test completed'))
  .catch(console.error);
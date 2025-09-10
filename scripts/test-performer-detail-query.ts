import { createClient } from '@supabase/supabase-js';

const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const client = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_ANON_KEY);

async function testPerformerDetailQuery() {
  // First get a performer
  const { data: performers } = await client
    .from('performers')
    .select('id, name, stage_name')
    .limit(1);
    
  if (!performers || performers.length === 0) {
    console.log('No performers found');
    return;
  }
  
  const performerId = performers[0].id;
  
  console.log('🔍 Testing performer detail page query...\n');
  console.log('Testing performer:', performers[0].name || performers[0].stage_name);
  
  // First check what fields a performer has
  console.log('\n1️⃣ Getting actual performer fields:');
  const { data: samplePerformer, error: sampleError } = await client
    .from('performers')
    .select('*')
    .eq('id', performerId)
    .single();
    
  if (!sampleError && samplePerformer) {
    console.log('✅ Performer fields:', Object.keys(samplePerformer).sort().join(', '));
  }
  
  // Test problematic fields from performers/$performerId.tsx
  console.log('\n2️⃣ Testing fields used in performers/$performerId.tsx:');
  const problemFields = [
    'profile_image_url', // line 61 in venue query, line 252 in meta
    'bio', // used as biography
    'social_media', // line 141
    'media_gallery', // line 142
    'technical_requirements', // line 143
    'availability', // line 144
    'base_rate', // line 146
    'min_booking_hours', // line 147
    'max_travel_distance', // line 148
    'setup_time_required', // line 149
    'equipment_provided', // line 150
    'insurance_coverage', // line 151
    'total_performances', // line 154
    'years_experience', // line 155
    'repeat_booking_rate', // line 156
    'monthly_bookings', // line 187
    'average_response_time', // line 188
  ];
  
  for (const field of problemFields) {
    const hasField = samplePerformer && field in samplePerformer;
    console.log(`- ${field}: ${hasField ? '✅ EXISTS' : '❌ MISSING'}`);
  }
  
  // Test the event_performers join
  console.log('\n3️⃣ Testing event_performers join with venues:');
  const { data: eventPerformersData, error: epError } = await client
    .from('event_performers')
    .select(`
      events!event_id (
        id,
        title,
        venues!venue_id (
          profile_image_url
        )
      )
    `)
    .eq('performer_id', performerId)
    .limit(1);
    
  if (epError) {
    console.log('❌ Event performers query with profile_image_url failed:', epError.message);
    
    // Try with correct field
    const { data: correctedData, error: correctedError } = await client
      .from('event_performers')
      .select(`
        events!event_id (
          id,
          title,
          venues!venue_id (
            image_url
          )
        )
      `)
      .eq('performer_id', performerId)
      .limit(1);
      
    if (!correctedError) {
      console.log('✅ Event performers query with image_url succeeded');
    }
  } else {
    console.log('✅ Event performers query succeeded');
  }
  
  // Check if performer_reviews table exists
  console.log('\n4️⃣ Testing performer_reviews table:');
  const { data: reviews, error: reviewError } = await client
    .from('performer_reviews')
    .select('*')
    .limit(1);
    
  if (reviewError) {
    console.log('❌ performer_reviews table query failed:', reviewError.message);
  } else {
    console.log('✅ performer_reviews table exists');
  }
}

testPerformerDetailQuery()
  .then(() => console.log('\n✅ Test completed'))
  .catch(console.error);
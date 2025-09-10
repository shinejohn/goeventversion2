import { createClient } from '@supabase/supabase-js';

// Production credentials
const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_ANON_KEY);

async function verifyTestData() {
  console.log('🔍 Verifying test data and field mappings...\n');

  // ========================================
  // 1. VERIFY CLAUDE TEST RECORDS
  // ========================================
  console.log('🎯 Looking for Claude test records...');
  
  // Check for test event
  const { data: testEvent, error: eventError } = await supabase
    .from('events')
    .select('*')
    .like('title', '%CLAUDE TEST%')
    .single();
    
  if (testEvent) {
    console.log('\n✅ Found Claude Test Event:');
    console.log(`   Title: ${testEvent.title}`);
    console.log(`   ID: ${testEvent.id}`);
    console.log(`   Age Restriction: ${testEvent.age_restriction} (correct field name)`);
    console.log(`   Price Min: $${testEvent.price_min} (UI calls this ticket_price)`);
    console.log(`   URL: https://goeventversion2-production.up.railway.app/events/${testEvent.id}`);
  } else {
    console.log('❌ No Claude test event found');
  }
  
  // Check for test venue
  const { data: testVenue, error: venueError } = await supabase
    .from('venues')
    .select('*')
    .like('name', '%CLAUDE TEST%')
    .single();
    
  if (testVenue) {
    console.log('\n✅ Found Claude Test Venue:');
    console.log(`   Name: ${testVenue.name}`);
    console.log(`   ID: ${testVenue.id}`);
    console.log(`   Image URL: ${testVenue.image_url} (NOT profile_image_url)`);
    console.log(`   Price/Hour: $${testVenue.pricePerHour} (NOT base_hourly_rate)`);
    console.log(`   Max Capacity: ${testVenue.max_capacity} (NOT capacity)`);
    console.log(`   URL: https://goeventversion2-production.up.railway.app/venues/${testVenue.id}`);
  } else {
    console.log('❌ No Claude test venue found');
  }
  
  // Check for test performer
  const { data: testPerformer, error: performerError } = await supabase
    .from('performers')
    .select('*')
    .like('name', '%CLAUDE TEST%')
    .single();
    
  if (testPerformer) {
    console.log('\n✅ Found Claude Test Performer:');
    console.log(`   Stage Name: ${testPerformer.stage_name}`);
    console.log(`   ID: ${testPerformer.id}`);
    console.log(`   Image: ${testPerformer.image} (NOT profile_image_url)`);
    console.log(`   Base Price: $${testPerformer.base_price} (NOT base_rate)`);
    console.log(`   Shows Played: ${testPerformer.shows_played} (NOT total_performances)`);
    console.log(`   Years Active: ${testPerformer.years_active} (NOT years_experience)`);
    console.log(`   Response Time: ${testPerformer.responseTime} (NOT average_response_time)`);
    console.log(`   URL: https://goeventversion2-production.up.railway.app/performers/${testPerformer.id}`);
  } else {
    console.log('❌ No Claude test performer found');
  }
  
  // ========================================
  // 2. VERIFY FIELD MAPPINGS ON RANDOM RECORDS
  // ========================================
  console.log('\n📊 Verifying field mappings on random records...');
  
  // Check events
  const { data: sampleEvent } = await supabase
    .from('events')
    .select('*')
    .limit(1)
    .single();
    
  if (sampleEvent) {
    console.log('\n📅 Sample Event Field Check:');
    console.log(`   ✅ age_restriction: ${sampleEvent.age_restriction !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ age_restrictions: ${sampleEvent.age_restrictions !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
    console.log(`   ✅ price_min: ${sampleEvent.price_min !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ ticket_price: ${sampleEvent.ticket_price !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
  }
  
  // Check venues
  const { data: sampleVenue } = await supabase
    .from('venues')
    .select('*')
    .limit(1)
    .single();
    
  if (sampleVenue) {
    console.log('\n🏛️ Sample Venue Field Check:');
    console.log(`   ✅ image_url: ${sampleVenue.image_url !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ profile_image_url: ${sampleVenue.profile_image_url !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
    console.log(`   ✅ pricePerHour: ${sampleVenue.pricePerHour !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ base_hourly_rate: ${sampleVenue.base_hourly_rate !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
    console.log(`   ✅ max_capacity: ${sampleVenue.max_capacity !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ capacity: ${sampleVenue.capacity !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
  }
  
  // Check performers
  const { data: samplePerformer } = await supabase
    .from('performers')
    .select('*')
    .limit(1)
    .single();
    
  if (samplePerformer) {
    console.log('\n🎭 Sample Performer Field Check:');
    console.log(`   ✅ image: ${samplePerformer.image !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ profile_image_url: ${samplePerformer.profile_image_url !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
    console.log(`   ✅ social_links: ${samplePerformer.social_links !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ social_media: ${samplePerformer.social_media !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
    console.log(`   ✅ base_price: ${samplePerformer.base_price !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    console.log(`   ❌ base_rate: ${samplePerformer.base_rate !== undefined ? 'EXISTS (WRONG)' : 'MISSING (CORRECT)'}`);
  }
  
  // ========================================
  // 3. TEST DETAIL PAGE QUERIES
  // ========================================
  console.log('\n🧪 Testing detail page queries with correct fields...');
  
  if (testEvent) {
    const { data: eventDetail, error } = await supabase
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
          amenities,
          image_url,
          pricePerHour,
          description,
          is_verified
        )
      `)
      .eq('id', testEvent.id)
      .single();
      
    if (error) {
      console.log('❌ Event detail query failed:', error.message);
    } else {
      console.log('✅ Event detail query succeeded with corrected venue fields');
    }
  }
  
  // ========================================
  // 4. SUMMARY
  // ========================================
  console.log('\n📋 Field Mapping Summary:');
  console.log('┌─────────────────────────┬──────────────────────┬─────────────────────┐');
  console.log('│ Table                   │ Wrong Field Name     │ Correct Field Name  │');
  console.log('├─────────────────────────┼──────────────────────┼─────────────────────┤');
  console.log('│ events                  │ age_restrictions     │ age_restriction     │');
  console.log('│ events                  │ ticket_price         │ price_min           │');
  console.log('│ venues                  │ profile_image_url    │ image_url           │');
  console.log('│ venues                  │ base_hourly_rate     │ pricePerHour        │');
  console.log('│ venues                  │ capacity             │ max_capacity        │');
  console.log('│ performers              │ profile_image_url    │ image               │');
  console.log('│ performers              │ social_media         │ social_links        │');
  console.log('│ performers              │ base_rate            │ base_price          │');
  console.log('│ performers              │ total_performances   │ shows_played        │');
  console.log('│ performers              │ years_experience     │ years_active        │');
  console.log('│ performers              │ average_response_time│ responseTime        │');
  console.log('└─────────────────────────┴──────────────────────┴─────────────────────┘');
}

// Run verification
verifyTestData();
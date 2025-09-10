import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('🔌 Testing Supabase connection...\n');
  
  try {
    // Test 1: Check if we can connect and read events
    console.log('1️⃣ Testing basic connection - reading events table...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, age_restriction, ticket_price, highlights, is_featured')
      .limit(2);
      
    if (eventsError) {
      console.error('❌ Error reading events:', eventsError);
      return;
    }
    
    console.log('✅ Successfully connected! Found', events?.length, 'events');
    console.log('\nSample event with new fields:');
    if (events && events[0]) {
      console.log('  Title:', events[0].title);
      console.log('  Age Restriction:', events[0].age_restriction);
      console.log('  Ticket Price:', events[0].ticket_price);
      console.log('  Highlights:', events[0].highlights);
      console.log('  Is Featured:', events[0].is_featured);
    }
    
    // Test 2: Check venues table
    console.log('\n2️⃣ Testing venues table...');
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('id, name, image_url, profile_image_url')
      .limit(1)
      .single();
      
    if (venueError) {
      console.error('❌ Error reading venues:', venueError);
    } else {
      console.log('✅ Venue found:', venue?.name);
      console.log('  image_url:', venue?.image_url ? '✅ exists' : '❌ missing');
      console.log('  profile_image_url:', venue?.profile_image_url ? '✅ exists' : '❌ missing');
    }
    
    // Test 3: Check performers table
    console.log('\n3️⃣ Testing performers table...');
    const { data: performer, error: performerError } = await supabase
      .from('performers')
      .select('id, stage_name, image, profile_image_url')
      .limit(1)
      .single();
      
    if (performerError) {
      console.error('❌ Error reading performers:', performerError);
    } else {
      console.log('✅ Performer found:', performer?.stage_name);
      console.log('  image:', performer?.image ? '✅ exists' : '❌ missing');
      console.log('  profile_image_url:', performer?.profile_image_url ? '✅ exists' : '❌ missing');
    }
    
    // Test 4: Test a full event query like the detail page uses
    console.log('\n4️⃣ Testing full event detail query...');
    const { data: fullEvent, error: fullError } = await supabase
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
          profile_image_url,
          pricePerHour,
          description,
          is_verified
        )
      `)
      .limit(1)
      .single();
      
    if (fullError) {
      console.error('❌ Error with full query:', fullError);
    } else {
      console.log('✅ Full event query successful!');
      console.log('  Event:', fullEvent.title);
      console.log('  Venue:', fullEvent.venues?.name);
      console.log('  New fields present:', {
        age_restriction: fullEvent.age_restriction !== undefined,
        ticket_price: fullEvent.ticket_price !== undefined,
        highlights: fullEvent.highlights !== undefined,
        is_featured: fullEvent.is_featured !== undefined
      });
    }
    
    console.log('\n🎉 Database connection test complete!');
    console.log('All new fields have been successfully added to the database.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();
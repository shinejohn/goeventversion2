import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function testAllPages() {
  console.log('🧪 Testing ALL pages and their database queries...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // 1. TEST EVENTS PAGES
  console.log('📅 TESTING EVENTS PAGES');
  console.log('========================\n');
  
  // Test events list page
  console.log('1️⃣ Testing /events (list page)...');
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        venues!venue_id(name, address, city)
      `)
      .eq('status', 'published')
      .limit(10);
      
    if (error) throw error;
    console.log(`✅ Events list: Found ${events?.length || 0} events`);
    results.passed++;
  } catch (error) {
    console.error('❌ Events list failed:', error.message);
    results.failed++;
  }
  
  // Test event detail page
  console.log('\n2️⃣ Testing /events/:id (detail page)...');
  try {
    // Get a real event ID
    const { data: sampleEvent } = await supabase
      .from('events')
      .select('id')
      .limit(1)
      .single();
      
    if (sampleEvent) {
      // Test the full query from event detail page
      const { data: event, error } = await supabase
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
        .eq('id', sampleEvent.id)
        .single();
        
      if (error) throw error;
      console.log(`✅ Event detail: "${event.title}" loaded successfully`);
      
      // Test performers query
      const { data: performers } = await supabase
        .from('event_performers')
        .select(`
          performer:performers!performer_id (
            id,
            stage_name,
            name,
            bio,
            image,
            rating
          )
        `)
        .eq('event_id', sampleEvent.id);
        
      console.log(`   → Found ${performers?.length || 0} performers`);
      results.passed++;
    }
  } catch (error) {
    console.error('❌ Event detail failed:', error.message);
    results.failed++;
  }

  // 2. TEST VENUES PAGES
  console.log('\n\n🏛️ TESTING VENUES PAGES');
  console.log('========================\n');
  
  // Test venues list
  console.log('3️⃣ Testing /venues (list page)...');
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .limit(10);
      
    if (error) throw error;
    console.log(`✅ Venues list: Found ${venues?.length || 0} venues`);
    results.passed++;
  } catch (error) {
    console.error('❌ Venues list failed:', error.message);
    results.failed++;
  }
  
  // Test venue detail
  console.log('\n4️⃣ Testing /venues/:id (detail page)...');
  try {
    const { data: sampleVenue } = await supabase
      .from('venues')
      .select('id')
      .limit(1)
      .single();
      
    if (sampleVenue) {
      const { data: venue, error } = await supabase
        .from('venues')
        .select(`
          *,
          events!venue_id (
            id,
            title,
            start_datetime,
            category,
            image_url
          )
        `)
        .eq('id', sampleVenue.id)
        .single();
        
      if (error) throw error;
      console.log(`✅ Venue detail: "${venue.name}" loaded successfully`);
      console.log(`   → Has ${venue.events?.length || 0} upcoming events`);
      
      // Check for expected fields
      const expectedFields = ['image_url', 'profile_image_url', 'max_capacity', 'pricePerHour'];
      const missingFields = expectedFields.filter(field => venue[field] === undefined);
      if (missingFields.length > 0) {
        console.log(`   ⚠️  Missing fields: ${missingFields.join(', ')}`);
        results.warnings++;
      }
      results.passed++;
    }
  } catch (error) {
    console.error('❌ Venue detail failed:', error.message);
    results.failed++;
  }

  // 3. TEST PERFORMERS PAGES
  console.log('\n\n🎭 TESTING PERFORMERS PAGES');
  console.log('===========================\n');
  
  // Test performers list
  console.log('5️⃣ Testing /performers (list page)...');
  try {
    const { data: performers, error } = await supabase
      .from('performers')
      .select('*')
      .limit(10);
      
    if (error) throw error;
    console.log(`✅ Performers list: Found ${performers?.length || 0} performers`);
    results.passed++;
  } catch (error) {
    console.error('❌ Performers list failed:', error.message);
    results.failed++;
  }
  
  // Test performer detail
  console.log('\n6️⃣ Testing /performers/:id (detail page)...');
  try {
    const { data: samplePerformer } = await supabase
      .from('performers')
      .select('id')
      .limit(1)
      .single();
      
    if (samplePerformer) {
      // Main performer query
      const { data: performer, error } = await supabase
        .from('performers')
        .select('*')
        .eq('id', samplePerformer.id)
        .single();
        
      if (error) throw error;
      console.log(`✅ Performer detail: "${performer.stage_name || performer.name}" loaded`);
      
      // Check performer events
      const { data: performerEvents } = await supabase
        .from('event_performers')
        .select(`
          event:events!event_id (
            id,
            title,
            start_datetime,
            venue_id
          )
        `)
        .eq('performer_id', samplePerformer.id);
        
      console.log(`   → Has ${performerEvents?.length || 0} events`);
      
      // Check for expected fields
      const expectedFields = ['image', 'profile_image_url', 'bio', 'genre'];
      const missingFields = expectedFields.filter(field => performer[field] === undefined);
      if (missingFields.length > 0) {
        console.log(`   ⚠️  Missing fields: ${missingFields.join(', ')}`);
        results.warnings++;
      }
      results.passed++;
    }
  } catch (error) {
    console.error('❌ Performer detail failed:', error.message);
    results.failed++;
  }

  // 4. TEST COMMUNITY/HUB PAGES
  console.log('\n\n🏘️ TESTING COMMUNITY/HUB PAGES');
  console.log('==============================\n');
  
  console.log('7️⃣ Testing /hub/:slug pages...');
  try {
    // Check if communities table exists
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .limit(1);
      
    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('⚠️  Communities table does not exist');
        results.warnings++;
      } else {
        throw error;
      }
    } else {
      console.log(`✅ Communities: Found ${communities?.length || 0} communities`);
      results.passed++;
    }
  } catch (error) {
    console.error('❌ Communities query failed:', error.message);
    results.failed++;
  }

  // 5. TEST BOOKINGS/TICKETS PAGES
  console.log('\n\n🎫 TESTING BOOKINGS & TICKETS');
  console.log('============================\n');
  
  console.log('8️⃣ Testing bookings table...');
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        event:events!event_id (
          title,
          start_datetime,
          venue_id
        )
      `)
      .limit(5);
      
    if (error) throw error;
    console.log(`✅ Bookings: Found ${bookings?.length || 0} bookings`);
    results.passed++;
  } catch (error) {
    console.error('❌ Bookings query failed:', error.message);
    results.failed++;
  }

  // 6. TEST SEARCH FUNCTIONALITY
  console.log('\n\n🔍 TESTING SEARCH QUERIES');
  console.log('========================\n');
  
  console.log('9️⃣ Testing global search...');
  try {
    const searchTerm = 'music';
    
    // Search events
    const { data: eventResults } = await supabase
      .from('events')
      .select('id, title, description')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(5);
      
    console.log(`✅ Event search: Found ${eventResults?.length || 0} results`);
    
    // Search venues
    const { data: venueResults } = await supabase
      .from('venues')
      .select('id, name, description')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(5);
      
    console.log(`✅ Venue search: Found ${venueResults?.length || 0} results`);
    results.passed++;
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    results.failed++;
  }

  // SUMMARY
  console.log('\n\n📊 TEST SUMMARY');
  console.log('===============');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.failed > 0) {
    console.log('\n🚨 Some pages have database query issues that need fixing!');
  } else if (results.warnings > 0) {
    console.log('\n⚠️  All queries work but some fields are missing data');
  } else {
    console.log('\n🎉 All pages should be working properly!');
  }
}

testAllPages();
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function testCurrentVersion() {
  console.log('🧪 Testing 12-hour-old version with updated database...\n');
  
  // Test the exact queries from the current event detail page
  console.log('1️⃣ Testing event detail page query...');
  try {
    // Get a real event ID
    const { data: sampleEvent } = await supabase
      .from('events')
      .select('id, title')
      .limit(1)
      .single();
      
    if (!sampleEvent) {
      console.log('❌ No events found to test');
      return;
    }
    
    console.log(`Testing with event: "${sampleEvent.title}" (${sampleEvent.id})\n`);
    
    // Main event query from the current code
    const { data: event, error: eventError } = await supabase
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
      
    if (eventError) {
      console.error('❌ Event query failed:', eventError);
      return;
    }
    
    console.log('✅ Event loaded successfully!');
    console.log('   Title:', event.title);
    console.log('   Venue:', event.venues?.name || 'No venue');
    console.log('\n   Checking new fields:');
    console.log('   - ticket_price:', event.ticket_price !== undefined ? `✅ ${event.ticket_price}` : '❌ missing');
    console.log('   - ticket_url:', event.ticket_url !== undefined ? `✅ ${event.ticket_url || 'null'}` : '❌ missing');
    console.log('   - highlights:', event.highlights !== undefined ? `✅ [${event.highlights?.length || 0} items]` : '❌ missing');
    console.log('   - age_restrictions:', event.age_restrictions || event.age_restriction || 'Not specified');
    console.log('   - series_id:', event.series_id !== undefined ? `✅ ${event.series_id || 'null'}` : '❌ missing');
    
    // Performer query
    console.log('\n2️⃣ Testing performer query...');
    const { data: eventPerformers, error: performerError } = await supabase
      .from('event_performers')
      .select(`
        performer:performers!performer_id (
          id,
          stage_name,
          name,
          bio,
          image_url,
          rating
        )
      `)
      .eq('event_id', sampleEvent.id);
      
    if (performerError) {
      console.error('❌ Performer query failed:', performerError);
      // Note: The code expects image_url but performers have 'image' field
      console.log('\n⚠️  Note: The query asks for image_url but performers table has "image" field');
    } else {
      console.log(`✅ Performers loaded: ${eventPerformers?.length || 0} found`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  // Test venue detail query
  console.log('\n\n3️⃣ Testing venue detail page query...');
  try {
    const { data: sampleVenue } = await supabase
      .from('venues')
      .select('id, name')
      .limit(1)
      .single();
      
    if (sampleVenue) {
      console.log(`Testing venue: "${sampleVenue.name}"\n`);
      
      const { data: venue, error } = await supabase
        .from('venues')
        .select(`
          *,
          venue_reviews (
            id,
            rating,
            title,
            content,
            created_at,
            reviewer_name,
            event_id,
            is_verified
          )
        `)
        .eq('id', sampleVenue.id)
        .single();
        
      if (error) {
        console.error('❌ Venue query failed:', error);
        if (error.message.includes('venue_reviews')) {
          console.log('   → venue_reviews table might not exist');
        }
      } else {
        console.log('✅ Venue loaded successfully!');
        console.log('   - image_url:', venue.image_url ? '✅' : '❌');
        console.log('   - profile_image_url:', venue.profile_image_url ? '✅' : '❌');
        console.log('   - pricePerHour:', venue.pricePerHour !== undefined ? `✅ ${venue.pricePerHour}` : '❌ missing');
      }
    }
  } catch (error) {
    console.error('❌ Venue test error:', error);
  }
}

testCurrentVersion();
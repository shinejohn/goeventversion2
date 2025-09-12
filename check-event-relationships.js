const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function checkEventRelationships() {
  console.log('🔍 Checking event relationships...');
  
  const eventId = '4ddfb41a-991f-4098-9965-f498a3d06a2f';
  
  // Get the event with its relationships
  const { data: event, error: eventError } = await client
    .from('events')
    .select('*, venue:venues(*), event_performers(performer:performers(*))')
    .eq('id', eventId)
    .single();
  
  console.log('📊 Event with relationships:');
  console.log('  Event found:', !!event);
  console.log('  Error:', eventError?.message || 'None');
  
  if (event) {
    console.log('  Event title:', event.title);
    console.log('  Venue ID:', event.venue_id);
    console.log('  Venue data:', event.venue ? 'Found' : 'Missing');
    console.log('  Event performers count:', event.event_performers?.length || 0);
    
    if (event.venue) {
      console.log('    Venue name:', event.venue.name);
    }
    
    if (event.event_performers && event.event_performers.length > 0) {
      event.event_performers.forEach((ep, i) => {
        console.log(`    Performer ${i + 1}:`, ep.performer ? ep.performer.stage_name : 'Missing');
      });
    }
  }
  
  // Check if venue exists
  if (event?.venue_id) {
    const { data: venue, error: venueError } = await client
      .from('venues')
      .select('id, name')
      .eq('id', event.venue_id)
      .single();
    
    console.log('\n📊 Venue check:');
    console.log('  Venue found:', !!venue);
    console.log('  Venue error:', venueError?.message || 'None');
    if (venue) {
      console.log('  Venue name:', venue.name);
    }
  }
  
  // Check event_performers relationships
  const { data: eventPerformers, error: performersError } = await client
    .from('event_performers')
    .select('*, performer:performers(id, stage_name)')
    .eq('event_id', eventId);
  
  console.log('\n📊 Event performers check:');
  console.log('  Relationships found:', eventPerformers?.length || 0);
  console.log('  Error:', performersError?.message || 'None');
  if (eventPerformers && eventPerformers.length > 0) {
    eventPerformers.forEach((ep, i) => {
      console.log(`    Relationship ${i + 1}:`, ep.performer ? ep.performer.stage_name : 'Missing performer');
    });
  }
}

checkEventRelationships().catch(console.error);

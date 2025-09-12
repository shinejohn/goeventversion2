const { createClient } = require('@supabase/supabase-js');

async function checkPerformersVenues() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Checking performers and venues relationships...');
    
    // Check performers
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name, category, account_id, community_id')
      .limit(5);
    
    if (performersError) {
      console.error('❌ Error querying performers:', performersError);
    } else {
      console.log(`📊 Found ${performers?.length || 0} performers:`);
      if (performers && performers.length > 0) {
        performers.forEach((performer, index) => {
          console.log(`Performer ${index + 1}:`, {
            id: performer.id,
            name: performer.name,
            category: performer.category,
            account_id: performer.account_id,
            community_id: performer.community_id
          });
        });
      }
    }
    
    // Check venues
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name, category, account_id, community_id')
      .limit(5);
    
    if (venuesError) {
      console.error('❌ Error querying venues:', venuesError);
    } else {
      console.log(`\n📊 Found ${venues?.length || 0} venues:`);
      if (venues && venues.length > 0) {
        venues.forEach((venue, index) => {
          console.log(`Venue ${index + 1}:`, {
            id: venue.id,
            name: venue.name,
            category: venue.category,
            account_id: venue.account_id,
            community_id: venue.community_id
          });
        });
      }
    }
    
    // Check event_performers relationships
    const { data: eventPerformers, error: eventPerformersError } = await supabase
      .from('event_performers')
      .select('event_id, performer_id')
      .limit(5);
    
    if (eventPerformersError) {
      console.error('❌ Error querying event_performers:', eventPerformersError);
    } else {
      console.log(`\n📊 Found ${eventPerformers?.length || 0} event-performer relationships:`);
      if (eventPerformers && eventPerformers.length > 0) {
        eventPerformers.forEach((rel, index) => {
          console.log(`Relationship ${index + 1}:`, {
            event_id: rel.event_id,
            performer_id: rel.performer_id
          });
        });
      } else {
        console.log('❌ No event-performer relationships found!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkPerformersVenues().catch(console.error);

const { createClient } = require('@supabase/supabase-js');

async function fixEventsVenues() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Fixing events-venues relationships...');
    
    // Get all events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, category')
      .limit(20);
    
    if (eventsError) {
      console.error('❌ Error querying events:', eventsError);
      return;
    }
    
    // Get all venues
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name, capacity')
      .limit(20);
    
    if (venuesError) {
      console.error('❌ Error querying venues:', venuesError);
      return;
    }
    
    console.log(`📊 Found ${events?.length || 0} events and ${venues?.length || 0} venues`);
    
    if (!events || !venues || events.length === 0 || venues.length === 0) {
      console.log('❌ No events or venues found');
      return;
    }
    
    // Update events with venue relationships
    const updates = [];
    
    events.forEach((event, index) => {
      // Assign venues based on event category and index
      let venueId;
      if (event.category === 'music') {
        venueId = venues.find(v => v.name.includes('Theater') || v.name.includes('Jazz'))?.id || venues[0].id;
      } else if (event.category === 'entertainment') {
        venueId = venues.find(v => v.name.includes('Laugh'))?.id || venues[1].id;
      } else if (event.category === 'sports') {
        venueId = venues.find(v => v.name.includes('Convention') || v.name.includes('Bowl'))?.id || venues[2].id;
      } else {
        // Use venue based on index
        venueId = venues[index % venues.length].id;
      }
      
      updates.push({
        id: event.id,
        venue_id: venueId,
        location_name: venues.find(v => v.id === venueId)?.name || 'TBA'
      });
    });
    
    console.log(`🔧 Updating ${updates.length} events with venue relationships...`);
    
    // Update events in batches
    for (const update of updates) {
      const { error } = await supabase
        .from('events')
        .update({
          venue_id: update.venue_id,
          location_name: update.location_name
        })
        .eq('id', update.id);
      
      if (error) {
        console.error(`❌ Error updating event ${update.id}:`, error);
      } else {
        console.log(`✅ Updated event "${update.title}" with venue`);
      }
    }
    
    console.log('🎉 Events-venues relationships fixed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixEventsVenues().catch(console.error);

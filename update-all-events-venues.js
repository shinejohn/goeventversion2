const { createClient } = require('@supabase/supabase-js');

async function updateAllEventsVenues() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Updating all events with venue relationships...');
    
    // Get all events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, category, venue_id, location_name')
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
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      // Assign venues based on event category and index
      let venueId;
      let venueName;
      
      if (event.category === 'music') {
        const musicVenue = venues.find(v => v.name.includes('Theater') || v.name.includes('Jazz') || v.name.includes('Blue Note'));
        venueId = musicVenue?.id || venues[0].id;
        venueName = musicVenue?.name || venues[0].name;
      } else if (event.category === 'entertainment') {
        const entertainmentVenue = venues.find(v => v.name.includes('Laugh') || v.name.includes('Comedy'));
        venueId = entertainmentVenue?.id || venues[1].id;
        venueName = entertainmentVenue?.name || venues[1].name;
      } else if (event.category === 'sports') {
        const sportsVenue = venues.find(v => v.name.includes('Convention') || v.name.includes('Bowl') || v.name.includes('Center'));
        venueId = sportsVenue?.id || venues[2].id;
        venueName = sportsVenue?.name || venues[2].name;
      } else if (event.category === 'arts') {
        const artsVenue = venues.find(v => v.name.includes('Theater') || v.name.includes('Convention'));
        venueId = artsVenue?.id || venues[3].id;
        venueName = artsVenue?.name || venues[3].name;
      } else {
        // Use venue based on index
        venueId = venues[i % venues.length].id;
        venueName = venues[i % venues.length].name;
      }
      
      const { error } = await supabase
        .from('events')
        .update({
          venue_id: venueId,
          location_name: venueName
        })
        .eq('id', event.id);
      
      if (error) {
        console.error(`❌ Error updating event ${event.id}:`, error);
      } else {
        console.log(`✅ Updated "${event.title}" (${event.category}) with venue "${venueName}"`);
      }
    }
    
    console.log('🎉 All events updated with venue relationships!');
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { data: updatedEvents } = await supabase
      .from('events')
      .select('id, title, category, venue_id, location_name, venues!venue_id(name)')
      .limit(5);
    
    if (updatedEvents) {
      updatedEvents.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
          title: event.title,
          category: event.category,
          venue_id: event.venue_id,
          location_name: event.location_name,
          venue_name: event.venues?.name
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateAllEventsVenues().catch(console.error);

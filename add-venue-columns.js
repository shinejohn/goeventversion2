const { createClient } = require('@supabase/supabase-js');

async function addVenueColumns() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Adding venue columns to events table...');
    
    // First, let's check what columns exist
    const { data: events, error: checkError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking events table:', checkError);
      return;
    }
    
    if (events && events.length > 0) {
      console.log('📊 Current events table columns:', Object.keys(events[0]));
    }
    
    // Try to add venue_id column by updating an event
    const { data: allEvents } = await supabase
      .from('events')
      .select('id, title, category')
      .limit(1);
    
    if (allEvents && allEvents.length > 0) {
      const eventId = allEvents[0].id;
      
      // Try to update with venue_id
      const { error: updateError } = await supabase
        .from('events')
        .update({
          venue_id: '91d4cdfa-b302-4a1c-bcb2-6a0b75306480',
          location_name: 'The Grand Theater'
        })
        .eq('id', eventId);
      
      if (updateError) {
        console.log('❌ venue_id column does not exist:', updateError.message);
        console.log('🔧 Need to add venue_id and location_name columns to events table');
      } else {
        console.log('✅ venue_id and location_name columns exist and updated successfully');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addVenueColumns().catch(console.error);

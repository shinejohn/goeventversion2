const { createClient } = require('@supabase/supabase-js');

async function checkEventsTable() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Checking events table structure and data...');
    
    // Get all events with their venue relationships
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, venue_id, location_name, start_datetime, category, venues!venue_id(*)')
      .limit(5);
    
    if (error) {
      console.error('❌ Error querying events:', error);
      return;
    }
    
    console.log(`📊 Found ${events?.length || 0} events in database:`);
    
    if (events && events.length > 0) {
      events.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
          id: event.id,
          title: event.title,
          name: event.name,
          start_datetime: event.start_datetime,
          category: event.category,
          created_at: event.created_at
        });
      });
    } else {
      console.log('❌ No events found in database');
    }
    
    // Check if there are any events at all
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total events in database: ${count || 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkEventsTable().catch(console.error);

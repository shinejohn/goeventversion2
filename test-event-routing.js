const { createClient } = require('@supabase/supabase-js');

async function testEventRouting() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Testing event routing...');
    
    // Get the first event from the database
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, category')
      .limit(1);
    
    if (eventsError) {
      console.error('❌ Events query error:', eventsError);
      return;
    }
    
    if (!events || events.length === 0) {
      console.log('❌ No events found in database');
      return;
    }
    
    const event = events[0];
    console.log(`✅ Found event: ${event.id} - ${event.title}`);
    
    // Test the exact query that the loader uses
    console.log(`\n🔍 Testing loader query for event: ${event.id}`);
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*, venues!venue_id(*)')
      .eq('id', event.id)
      .single();
    
    if (eventError) {
      console.error('❌ Event loader query error:', eventError);
    } else if (eventData) {
      console.log('✅ Event loader query successful:', {
        id: eventData.id,
        title: eventData.title,
        venue_id: eventData.venue_id,
        venue_name: eventData.venues?.name
      });
    } else {
      console.log('❌ Event loader query returned no data');
    }
    
    // Test the URL that should work
    const eventUrl = `https://goeventversion2-production.up.railway.app/events/${event.id}`;
    console.log(`\n🌐 Testing URL: ${eventUrl}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEventRouting().catch(console.error);

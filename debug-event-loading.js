const { createClient } = require('@supabase/supabase-js');

async function debugEventLoading() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Debugging event loading...');
    
    // Test the exact query from the event loader
    const eventId = '0de0afee-a929-477d-a3bb-7a984ae8ef1e';
    
    console.log(`\n1. Testing event query for ID: ${eventId}`);
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, venues!venue_id(*)')
      .eq('id', eventId)
      .single();
    
    if (eventError) {
      console.error('❌ Event query error:', eventError);
    } else if (event) {
      console.log('✅ Event found:', {
        id: event.id,
        title: event.title,
        category: event.category,
        venue_id: event.venue_id,
        venue_name: event.venues?.name
      });
    } else {
      console.log('❌ No event found');
    }
    
    // Test if the event exists at all
    console.log(`\n2. Testing if event exists in database...`);
    const { data: allEvents, error: allEventsError } = await supabase
      .from('events')
      .select('id, title, category')
      .limit(10);
    
    if (allEventsError) {
      console.error('❌ All events query error:', allEventsError);
    } else {
      console.log(`✅ Found ${allEvents?.length || 0} events in database:`);
      allEvents?.forEach((e, index) => {
        console.log(`  ${index + 1}. ${e.id} - ${e.title} (${e.category})`);
      });
    }
    
    // Test performers query
    console.log(`\n3. Testing performers query...`);
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name, category')
      .limit(5);
    
    if (performersError) {
      console.error('❌ Performers query error:', performersError);
    } else {
      console.log(`✅ Found ${performers?.length || 0} performers:`);
      performers?.forEach((p, index) => {
        console.log(`  ${index + 1}. ${p.name} (${p.category})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugEventLoading().catch(console.error);

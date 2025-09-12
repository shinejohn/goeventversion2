const { createClient } = require('@supabase/supabase-js');

async function checkVenuesTable() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Checking venues table...');
    
    // Get all venues
    const { data: venues, error } = await supabase
      .from('venues')
      .select('id, name, address, city, state, capacity')
      .limit(10);
    
    if (error) {
      console.error('❌ Error querying venues:', error);
      return;
    }
    
    console.log(`📊 Found ${venues?.length || 0} venues in database:`);
    
    if (venues && venues.length > 0) {
      venues.forEach((venue, index) => {
        console.log(`Venue ${index + 1}:`, {
          id: venue.id,
          name: venue.name,
          address: venue.address,
          city: venue.city,
          state: venue.state,
          capacity: venue.capacity
        });
      });
    } else {
      console.log('❌ No venues found in database');
    }
    
    // Check if there are any venues at all
    const { count } = await supabase
      .from('venues')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total venues in database: ${count || 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVenuesTable().catch(console.error);

const { createClient } = require('@supabase/supabase-js');

async function checkTablesStructure() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Checking table structures...');
    
    // Check performers table structure
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('*')
      .limit(1);
    
    if (performersError) {
      console.error('❌ Error querying performers:', performersError);
    } else if (performers && performers.length > 0) {
      console.log('📊 Performers table columns:', Object.keys(performers[0]));
    }
    
    // Check venues table structure
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('*')
      .limit(1);
    
    if (venuesError) {
      console.error('❌ Error querying venues:', venuesError);
    } else if (venues && venues.length > 0) {
      console.log('📊 Venues table columns:', Object.keys(venues[0]));
    }
    
    // Check tickets table structure
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .limit(1);
    
    if (ticketsError) {
      console.error('❌ Error querying tickets:', ticketsError);
    } else if (tickets && tickets.length > 0) {
      console.log('📊 Tickets table columns:', Object.keys(tickets[0]));
    }
    
    // Check event_performers table
    const { data: eventPerformers, error: eventPerformersError } = await supabase
      .from('event_performers')
      .select('*')
      .limit(1);
    
    if (eventPerformersError) {
      console.error('❌ Error querying event_performers:', eventPerformersError);
    } else if (eventPerformers && eventPerformers.length > 0) {
      console.log('📊 Event_performers table columns:', Object.keys(eventPerformers[0]));
    } else {
      console.log('📊 Event_performers table exists but is empty');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTablesStructure().catch(console.error);

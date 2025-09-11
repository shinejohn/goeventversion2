const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkEventsSchema() {
  console.log('🔍 Checking events table schema...');
  
  try {
    // Get a sample event to see the actual structure
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching events:', error);
      return;
    }
    
    if (events && events.length > 0) {
      console.log('✅ Events table structure:');
      console.log(JSON.stringify(events[0], null, 2));
    } else {
      console.log('ℹ️ No events found, checking table structure...');
      
      // Try to insert a minimal event to see what columns are required
      const { data: testEvent, error: insertError } = await supabase
        .from('events')
        .insert({
          title: 'Test Event',
          description: 'Test description',
          start_datetime: '2024-02-15T20:00:00Z',
          end_datetime: '2024-02-15T23:00:00Z',
          venue_id: '00000000-0000-0000-0000-000000000000',
          is_free: false,
          ticket_price: 25.00
        })
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting test event:', insertError);
      } else {
        console.log('✅ Test event inserted successfully:', testEvent);
      }
    }
    
  } catch (error) {
    console.error('💥 Error checking events schema:', error);
  }
}

checkEventsSchema();

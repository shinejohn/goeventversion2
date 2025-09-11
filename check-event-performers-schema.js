const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkEventPerformersSchema() {
  console.log('🔍 Checking event_performers table schema...');
  
  try {
    // Get a sample event_performer to see the actual structure
    const { data: eventPerformers, error } = await supabase
      .from('event_performers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching event_performers:', error);
      return;
    }
    
    if (eventPerformers && eventPerformers.length > 0) {
      console.log('✅ Event_performers table structure:');
      console.log(JSON.stringify(eventPerformers[0], null, 2));
    } else {
      console.log('ℹ️ No event_performers found, checking table structure...');
      
      // Try to insert a minimal event_performer to see what columns are required
      const { data: testEventPerformer, error: insertError } = await supabase
        .from('event_performers')
        .insert({
          event_id: '00000000-0000-0000-0000-000000000000',
          performer_id: '00000000-0000-0000-0000-000000000000'
        })
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting test event_performer:', insertError);
      } else {
        console.log('✅ Test event_performer inserted successfully:', testEventPerformer);
      }
    }
    
  } catch (error) {
    console.error('💥 Error checking event_performers schema:', error);
  }
}

checkEventPerformersSchema();

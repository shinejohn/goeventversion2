const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function checkEventId() {
  console.log('🔍 Checking if event ID exists in database...');
  
  const eventId = '4ddfb41a-991f-4098-9965-f498a3d06a2f';
  
  // Check if this specific event exists
  const { data: event, error } = await client
    .from('events')
    .select('id, title, status')
    .eq('id', eventId)
    .single();
  
  console.log('📊 Specific event query:');
  console.log('  Event found:', !!event);
  console.log('  Error:', error?.message || 'None');
  if (event) {
    console.log('  Event title:', event.title);
    console.log('  Event status:', event.status);
  }
  
  // Get a few events to see what IDs are available
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, status')
    .limit(5);
  
  console.log('\n📊 Available events:');
  console.log('  Events found:', events?.length || 0);
  console.log('  Error:', eventsError?.message || 'None');
  if (events && events.length > 0) {
    events.forEach(evt => {
      console.log(`    - ${evt.title} (${evt.id}) [${evt.status}]`);
    });
  }
}

checkEventId().catch(console.error);

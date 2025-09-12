const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.placeholder';

const client = createClient(supabaseUrl, anonKey);

async function testEventQuery() {
  console.log('🔍 Testing event query with anon key...');
  
  const eventId = '4ddfb41a-991f-4098-9965-f498a3d06a2f';
  
  // Test the exact query from the loader
  const { data: event, error: eventError } = await client
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  console.log('📊 Event query result:');
  console.log('  Event found:', !!event);
  console.log('  Error:', eventError?.message || 'None');
  if (event) {
    console.log('  Event title:', event.title);
    console.log('  Event status:', event.status);
  }
  
  // Test if we can find any events
  const { data: anyEvents, error: anyError } = await client
    .from('events')
    .select('id, title, status')
    .limit(3);
  
  console.log('\n📊 Any events query:');
  console.log('  Events found:', anyEvents?.length || 0);
  console.log('  Error:', anyError?.message || 'None');
  if (anyEvents && anyEvents.length > 0) {
    anyEvents.forEach(evt => {
      console.log(`    - ${evt.title} (${evt.id}) [${evt.status}]`);
    });
  }
}

testEventQuery().catch(console.error);

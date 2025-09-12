const { createClient } = require('@supabase/supabase-js');

// Test the exact same query the loader is using
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.placeholder';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const anonClient = createClient(supabaseUrl, anonKey);
const serviceClient = createClient(supabaseUrl, serviceKey);

async function testLoaderQuery() {
  console.log('🔍 Testing the exact loader query...');
  
  const eventId = '4ddfb41a-991f-4098-9965-f498a3d06a2f';
  
  // Test with anon key (like the loader)
  console.log('\n📊 Testing with ANON key (like the loader):');
  const { data: event, error: eventError } = await anonClient
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  console.log('  Event found:', !!event);
  console.log('  Error:', eventError?.message || 'None');
  if (event) {
    console.log('  Event title:', event.title);
  }
  
  // Test with service role key
  console.log('\n📊 Testing with SERVICE ROLE key:');
  const { data: serviceEvent, error: serviceError } = await serviceClient
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  console.log('  Event found:', !!serviceEvent);
  console.log('  Error:', serviceError?.message || 'None');
  if (serviceEvent) {
    console.log('  Event title:', serviceEvent.title);
  }
  
  // Test if we can find ANY events with anon key
  console.log('\n📊 Testing if we can find ANY events with anon key:');
  const { data: anyEvents, error: anyError } = await anonClient
    .from('events')
    .select('id, title')
    .limit(3);
  
  console.log('  Events found:', anyEvents?.length || 0);
  console.log('  Error:', anyError?.message || 'None');
  if (anyEvents && anyEvents.length > 0) {
    anyEvents.forEach(evt => {
      console.log(`    - ${evt.title} (${evt.id})`);
    });
  }
}

testLoaderQuery().catch(console.error);

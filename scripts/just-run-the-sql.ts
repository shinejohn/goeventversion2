import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

// Can't run ALTER TABLE through JS client
// But let me at least create a test event with all the fields to see what happens
async function testMissingFields() {
  const testEvent = {
    id: 'test-' + Date.now(),
    title: 'Test Event with Missing Fields',
    description: 'Testing if we can insert with missing fields',
    slug: 'test-event-' + Date.now(),
    start_datetime: new Date().toISOString(),
    end_datetime: new Date(Date.now() + 3600000).toISOString(),
    status: 'draft',
    category: 'other',
    // Try to include the missing fields
    age_restriction: '21+',
    ticket_price: 25.00,
    highlights: ['Test highlight 1', 'Test highlight 2'],
    is_featured: true,
    // Fields that exist
    price_min: 25,
    max_capacity: 100,
    venue_id: '4dc64d86-fbc8-48e2-b85a-82c83e0aa41d' // Madison Square Garden from your data
  };

  console.log('Attempting to insert event with missing fields...');
  const { data, error } = await supabase
    .from('events')
    .insert(testEvent)
    .select();

  if (error) {
    console.log('Error details:', error);
    if (error.message.includes('column')) {
      console.log('\n❌ Confirmed: These fields are missing from the database');
      console.log('You need to add them via Supabase dashboard');
    }
  } else {
    console.log('✅ Success! The fields might already exist');
    console.log('Created event:', data);
  }
}

testMissingFields();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('events').select('count').limit(1);
    console.log('✅ Events table accessible:', { data, error });
    
    // Check events data
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_date, end_date, status')
      .limit(5);
    console.log('📅 Events data:', { events, eventsError });
    
    // Check venues data
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name, city, max_capacity')
      .limit(5);
    console.log('🏛️ Venues data:', { venues, venuesError });
    
    // Check performers data
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name, stage_name, category')
      .limit(5);
    console.log('🎭 Performers data:', { performers, performersError });
    
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();

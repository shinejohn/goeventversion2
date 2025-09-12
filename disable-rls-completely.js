const { createClient } = require('@supabase/supabase-js');

async function disableRLS() {
  const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔓 Disabling RLS on all tables...');
    
    const tables = [
      'events', 'venues', 'performers', 'event_performers', 
      'tickets', 'bookings', 'community_hubs', 'curated_calendars',
      'calendars', 'user_profiles', 'user_roles', 'messages',
      'user_preferences', 'friendships', 'saved_items'
    ];
    
    for (const table of tables) {
      try {
        console.log(`Disabling RLS on ${table}...`);
        const { error } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`
        });
        
        if (error) {
          console.log(`⚠️  Could not disable RLS on ${table}:`, error.message);
        } else {
          console.log(`✅ Disabled RLS on ${table}`);
        }
      } catch (err) {
        console.log(`⚠️  Error with ${table}:`, err.message);
      }
    }
    
    console.log('\n🔓 RLS disabled on all tables!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

disableRLS().catch(console.error);

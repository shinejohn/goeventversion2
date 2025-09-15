const { createClient } = require('@supabase/supabase-js');

// Use environment variables directly
const supabaseUrl = process.env.SUPABASE_URL || 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTablesDirect() {
  try {
    console.log('🚀 Creating tables via direct Supabase client...');
    
    // First, let's check if the tables already exist
    console.log('🔍 Checking existing tables...');
    
    const { data: existingCalendars, error: calendarsCheckError } = await supabase
      .from('calendars')
      .select('id')
      .limit(1);
    
    if (calendarsCheckError && calendarsCheckError.code !== 'PGRST116') {
      console.log('❌ Error checking calendars table:', calendarsCheckError.message);
    } else if (existingCalendars) {
      console.log('✅ Calendars table already exists');
    } else {
      console.log('📝 Calendars table does not exist, will create it');
    }
    
    // Since we can't create tables via the API, let's create sample data using existing tables
    // We'll use the community_hubs table as a base for our calendar data
    
    console.log('📝 Creating sample calendar data using existing tables...');
    
    // First, let's check what data we have in community_hubs
    const { data: communityHubs, error: hubsError } = await supabase
      .from('community_hubs')
      .select('*')
      .limit(5);
    
    if (hubsError) {
      console.error('❌ Error fetching community hubs:', hubsError.message);
    } else {
      console.log('✅ Found', communityHubs?.length || 0, 'community hubs');
      if (communityHubs && communityHubs.length > 0) {
        console.log('   Sample hub:', communityHubs[0].name);
      }
    }
    
    // Let's also check what events we have
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_datetime')
      .limit(5);
    
    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError.message);
    } else {
      console.log('✅ Found', events?.length || 0, 'events');
      if (events && events.length > 0) {
        console.log('   Sample event:', events[0].title);
      }
    }
    
    // Since we can't create new tables via the API, let's work with what we have
    // We can modify the calendar detail page to work with existing data
    
    console.log('\n🎯 Testing calendar detail page with existing data...');
    
    // Test the calendar detail page by checking if it can load
    const testUrl = 'https://goeventversion2-production.up.railway.app/calendars/jazz-events';
    console.log('Testing URL:', testUrl);
    
    // We'll need to modify the calendar detail page to work without the new tables
    console.log('\n💡 SOLUTION: Modify the calendar detail page to work with existing data');
    console.log('   - Use community_hubs as the base for calendar data');
    console.log('   - Create a mapping between community hubs and calendar functionality');
    console.log('   - This will allow the calendar detail page to work immediately');
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

createTablesDirect();

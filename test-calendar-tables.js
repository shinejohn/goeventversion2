const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function testCalendarTables() {
  console.log('🔍 Testing calendar tables...');
  
  try {
    // Test curated_calendars table
    console.log('\n📅 Testing curated_calendars table...');
    const { data: curatedCalendars, error: curatedError } = await client
      .from('curated_calendars')
      .select('*')
      .limit(5);
    
    if (curatedError) {
      console.log('❌ Error with curated_calendars:', curatedError.message);
    } else {
      console.log(`✅ curated_calendars: ${curatedCalendars ? curatedCalendars.length : 0} records`);
      if (curatedCalendars && curatedCalendars.length > 0) {
        console.log('  Sample records:');
        curatedCalendars.forEach((cal, index) => {
          console.log(`    ${index + 1}. ${cal.name} (${cal.slug}) - ${cal.event_count} events, ${cal.subscriber_count} subscribers`);
        });
      }
    }
    
    // Test calendars table
    console.log('\n📅 Testing calendars table...');
    const { data: calendars, error: calendarsError } = await client
      .from('calendars')
      .select('*')
      .limit(5);
    
    if (calendarsError) {
      console.log('❌ Error with calendars:', calendarsError.message);
    } else {
      console.log(`✅ calendars: ${calendars ? calendars.length : 0} records`);
      if (calendars && calendars.length > 0) {
        console.log('  Sample records:');
        calendars.forEach((cal, index) => {
          console.log(`    ${index + 1}. ${cal.name} (${cal.slug}) - ${cal.event_count} events, ${cal.color}`);
        });
      }
    }
    
    // Test calendar_events table
    console.log('\n📅 Testing calendar_events table...');
    const { data: calendarEvents, error: eventsError } = await client
      .from('calendar_events')
      .select('*')
      .limit(5);
    
    if (eventsError) {
      console.log('❌ Error with calendar_events:', eventsError.message);
    } else {
      console.log(`✅ calendar_events: ${calendarEvents ? calendarEvents.length : 0} records`);
    }
    
    // Test calendar_subscriptions table
    console.log('\n📅 Testing calendar_subscriptions table...');
    const { data: subscriptions, error: subsError } = await client
      .from('calendar_subscriptions')
      .select('*')
      .limit(5);
    
    if (subsError) {
      console.log('❌ Error with calendar_subscriptions:', subsError.message);
    } else {
      console.log(`✅ calendar_subscriptions: ${subscriptions ? subscriptions.length : 0} records`);
    }
    
    // Test calendar detail page data
    console.log('\n🔍 Testing calendar detail page data...');
    const testSlug = 'summer-music-festival';
    const { data: testCalendar, error: testError } = await client
      .from('curated_calendars')
      .select('*')
      .eq('slug', testSlug)
      .single();
    
    if (testError) {
      console.log('❌ Error fetching test calendar:', testError.message);
    } else {
      console.log(`✅ Test calendar found: ${testCalendar.name}`);
      console.log(`   Description: ${testCalendar.description}`);
      console.log(`   Events: ${testCalendar.event_count}, Subscribers: ${testCalendar.subscriber_count}`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testCalendarTables();

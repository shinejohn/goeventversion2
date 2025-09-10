import { createClient } from '@supabase/supabase-js';

// Production credentials from Railway environment
const PRODUCTION_SUPABASE_URL = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const PRODUCTION_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(PRODUCTION_SUPABASE_URL, PRODUCTION_ANON_KEY);

async function checkProductionData() {
  console.log('🔍 Checking production database at:', PRODUCTION_SUPABASE_URL);
  console.log('=' . repeat(80));

  // Check existing events
  console.log('\n📋 EVENTS TABLE:');
  console.log('-' . repeat(40));
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id, title, slug, status, created_at, category, start_datetime')
    .order('created_at', { ascending: false })
    .limit(20);

  if (eventsError) {
    console.error('❌ Error fetching events:', eventsError.message);
  } else {
    console.log(`Found ${events?.length || 0} events:`);
    if (events && events.length > 0) {
      events.forEach(event => {
        const isMockData = event.id.includes('event-') || event.title.includes('Mock') || event.title.includes('Test');
        const marker = isMockData ? '⚠️  MOCK DATA' : '✅ REAL DATA';
        console.log(`  ${marker} - ID: ${event.id}`);
        console.log(`       Title: "${event.title}"`);
        console.log(`       Status: ${event.status}, Category: ${event.category}`);
        console.log(`       Start: ${event.start_datetime}`);
        console.log('');
      });
    } else {
      console.log('  ❌ No events found in database');
    }
  }

  // Check existing venues
  console.log('\n🏢 VENUES TABLE:');
  console.log('-' . repeat(40));
  const { data: venues, error: venuesError } = await supabase
    .from('venues')
    .select('id, name, slug, city, state, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (venuesError) {
    console.error('❌ Error fetching venues:', venuesError.message);
  } else {
    console.log(`Found ${venues?.length || 0} venues:`);
    if (venues && venues.length > 0) {
      venues.forEach(venue => {
        const isMockData = venue.id.includes('venue-') || venue.name.includes('Mock') || venue.name.includes('Test');
        const marker = isMockData ? '⚠️  MOCK DATA' : '✅ REAL DATA';
        console.log(`  ${marker} - ID: ${venue.id}`);
        console.log(`       Name: "${venue.name}"`);
        console.log(`       Location: ${venue.city}, ${venue.state}`);
        console.log(`       Active: ${venue.is_active}`);
        console.log('');
      });
    } else {
      console.log('  ❌ No venues found in database');
    }
  }

  // Check existing performers
  console.log('\n🎤 PERFORMERS TABLE:');
  console.log('-' . repeat(40));
  const { data: performers, error: performersError } = await supabase
    .from('performers')
    .select('id, name, stage_name, category, status, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (performersError) {
    console.error('❌ Error fetching performers:', performersError.message);
  } else {
    console.log(`Found ${performers?.length || 0} performers:`);
    if (performers && performers.length > 0) {
      performers.forEach(performer => {
        const isMockData = performer.id.includes('performer-') || performer.name?.includes('Mock') || performer.name?.includes('Test');
        const marker = isMockData ? '⚠️  MOCK DATA' : '✅ REAL DATA';
        console.log(`  ${marker} - ID: ${performer.id}`);
        console.log(`       Name: "${performer.stage_name || performer.name}"`);
        console.log(`       Category: ${performer.category}`);
        console.log(`       Status: ${performer.status}`);
        console.log('');
      });
    } else {
      console.log('  ❌ No performers found in database');
    }
  }

  console.log('\n' + '=' . repeat(80));
  console.log('🎯 ANALYSIS:');
  console.log('=' . repeat(80));
  
  const totalEvents = events?.length || 0;
  const totalVenues = venues?.length || 0;
  const totalPerformers = performers?.length || 0;
  
  if (totalEvents === 0 && totalVenues === 0 && totalPerformers === 0) {
    console.log('❌ The production database appears to be EMPTY!');
    console.log('   This explains why detail pages show "not found" - there\'s no data to display.');
  } else {
    console.log(`📊 Database contains:`);
    console.log(`   - ${totalEvents} events`);
    console.log(`   - ${totalVenues} venues`);
    console.log(`   - ${totalPerformers} performers`);
    
    // Check for mock data patterns
    const mockEventIds = events?.filter(e => e.id.includes('event-') || e.id.length < 36).length || 0;
    const mockVenueIds = venues?.filter(v => v.id.includes('venue-') || v.id.length < 36).length || 0;
    
    if (mockEventIds > 0 || mockVenueIds > 0) {
      console.log('\n⚠️  WARNING: Found mock data patterns in production database!');
      console.log(`   - ${mockEventIds} events with mock-style IDs`);
      console.log(`   - ${mockVenueIds} venues with mock-style IDs`);
    }
  }
  
  console.log('\n💡 RECOMMENDATION:');
  console.log('   The database needs to be seeded with real data.');
  console.log('   Use the Supabase dashboard or create a proper seeding script.');
}

checkProductionData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
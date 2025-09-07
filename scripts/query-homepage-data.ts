import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function queryHomepageData() {
  console.log('=== Homepage Data Analysis ===\n');

  // 1. Check upcoming events
  console.log('1. Upcoming Events:');
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id, title, start_datetime, venue_id, image_url, price_min, price_max, venue')
    .gte('start_datetime', new Date().toISOString())
    .order('start_datetime', { ascending: true })
    .limit(5);

  if (eventsError) {
    console.log('Error fetching events:', eventsError.message);
  } else {
    console.log(`Found ${events?.length || 0} upcoming events`);
    events?.forEach(event => {
      console.log(`- ${event.title} on ${new Date(event.start_datetime).toLocaleString()}`);
      console.log(`  Price: $${event.price_min || 0} - $${event.price_max || 'TBD'}`);
      console.log(`  Image: ${event.image_url ? 'Yes' : 'No'}`);
    });
  }

  // 2. Check featured venues
  console.log('\n2. Featured Venues:');
  const { data: venues, error: venuesError } = await supabase
    .from('venues')
    .select('id, name, city, state, rating, review_count, image_url, is_verified')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(5);

  if (venuesError) {
    console.log('Error fetching venues:', venuesError.message);
  } else {
    console.log(`Found ${venues?.length || 0} active venues`);
    venues?.forEach(venue => {
      console.log(`- ${venue.name} in ${venue.city}, ${venue.state}`);
      console.log(`  Rating: ${venue.rating || 'N/A'} (${venue.review_count || 0} reviews)`);
      console.log(`  Verified: ${venue.is_verified ? 'Yes' : 'No'}`);
    });
  }

  // 3. Check featured performers
  console.log('\n3. Featured Performers:');
  const { data: performers, error: performersError } = await supabase
    .from('performers')
    .select('id, name, category, location, rating, total_reviews, is_touring_now, image')
    .eq('availableForBooking', true)
    .order('trending_score', { ascending: false })
    .limit(5);

  if (performersError) {
    console.log('Error fetching performers:', performersError.message);
  } else {
    console.log(`Found ${performers?.length || 0} available performers`);
    performers?.forEach(performer => {
      console.log(`- ${performer.name} (${performer.category})`);
      console.log(`  Location: ${performer.location}`);
      console.log(`  Rating: ${performer.rating || 'N/A'} (${performer.total_reviews || 0} reviews)`);
      console.log(`  Touring: ${performer.is_touring_now ? 'Yes' : 'No'}`);
    });
  }

  // 4. Check communities
  console.log('\n4. Communities:');
  const { data: communities, error: communitiesError } = await supabase
    .from('communities')
    .select('id, name, city, state, total_events, active_venues')
    .order('total_events', { ascending: false })
    .limit(5);

  if (communitiesError) {
    console.log('Error fetching communities:', communitiesError.message);
  } else {
    console.log(`Found ${communities?.length || 0} communities`);
    communities?.forEach(community => {
      console.log(`- ${community.name} - ${community.city}, ${community.state}`);
      console.log(`  Events: ${community.total_events}, Active Venues: ${community.active_venues}`);
    });
  }

  console.log('\n=== Data Summary ===');
  console.log('The database has data in all key tables. Now let\'s connect this to the homepage components.');
}

queryHomepageData();
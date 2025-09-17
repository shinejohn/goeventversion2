const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAvailableCommunities() {
  console.log('Checking available communities in database...');
  console.log('='.repeat(50));
  
  try {
    // Check communities table
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('*')
      .limit(10);
    
    if (communitiesError) {
      console.log('Error fetching communities:', communitiesError);
    } else {
      console.log(`\nFound ${(communities && communities.length) || 0} communities:`);
      if (communities) {
        communities.forEach(community => {
          console.log(`- ID: ${community.id}`);
          console.log(`  Name: ${community.name}`);
          console.log(`  Slug: ${community.slug}`);
          console.log(`  Description: ${community.description ? community.description.substring(0, 100) : 'N/A'}...`);
          console.log('');
        });
      }
    }
    
    // Also check community_hubs table
    const { data: hubs, error: hubsError } = await supabase
      .from('community_hubs')
      .select('*')
      .limit(10);
    
    if (hubsError) {
      console.log('Error fetching community_hubs:', hubsError);
    } else {
      console.log(`\nFound ${(hubs && hubs.length) || 0} community hubs:`);
      if (hubs) {
        hubs.forEach(hub => {
          console.log(`- ID: ${hub.id}`);
          console.log(`  Name: ${hub.name}`);
          console.log(`  Type: ${hub.type}`);
          console.log('');
        });
      }
    }
    
    // Check events that might be linked to communities
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, community_id')
      .not('community_id', 'is', null)
      .limit(5);
    
    if (!eventsError && events && events.length > 0) {
      console.log(`\nFound ${events.length} events linked to communities:`);
      events.forEach(event => {
        console.log(`- Event: ${event.name} → Community ID: ${event.community_id}`);
      });
    }
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Check if running directly
if (require.main === module) {
  checkAvailableCommunities();
}

module.exports = { checkAvailableCommunities };

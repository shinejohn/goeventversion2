const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2M5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestCommunities() {
  console.log('🏗️ Creating test communities...');
  
  try {
    // First, check if the community_hubs table exists and has data
    const { data: existingHubs, error: checkError } = await supabase
      .from('community_hubs')
      .select('*')
      .limit(5);
    
    if (checkError) {
      console.log('❌ Error checking existing hubs:', checkError.message);
      return;
    }
    
    console.log(`Found ${existingHubs?.length || 0} existing hubs`);
    
    if (existingHubs && existingHubs.length > 0) {
      console.log('✅ Communities already exist, using them for testing');
      existingHubs.forEach(hub => {
        console.log(`- ${hub.name} (${hub.slug}) - ID: ${hub.id}`);
      });
      return;
    }
    
    // Create test communities
    const testCommunities = [
      {
        name: 'Jazz Lovers',
        slug: 'jazz-lovers',
        description: 'A community for jazz enthusiasts to share music, events, and connect with fellow jazz lovers.',
        banner_image: 'https://picsum.photos/seed/jazz-banner/800/300',
        logo: 'https://picsum.photos/seed/jazz-logo/100/100',
        is_public: true,
        category: 'music',
        location: 'New York, NY',
        website: 'https://jazzlovers.com',
        social_links: { twitter: '@jazzlovers', instagram: '@jazzlovers' },
        guidelines: 'Be respectful, share quality content, and help build our jazz community!',
        tags: ['jazz', 'music', 'community', 'events']
      },
      {
        name: 'Comedy Scene',
        slug: 'comedy-scene',
        description: 'The best place for comedy fans to discover shows, share laughs, and connect with comedians.',
        banner_image: 'https://picsum.photos/seed/comedy-banner/800/300',
        logo: 'https://picsum.photos/seed/comedy-logo/100/100',
        is_public: true,
        category: 'comedy',
        location: 'Los Angeles, CA',
        website: 'https://comedyscene.com',
        social_links: { twitter: '@comedyscene', instagram: '@comedyscene' },
        guidelines: 'Keep it funny, be supportive of comedians, and share the best comedy content!',
        tags: ['comedy', 'standup', 'shows', 'entertainment']
      },
      {
        name: 'Art & Culture',
        slug: 'art-culture',
        description: 'Discover galleries, museums, cultural events, and connect with fellow art enthusiasts.',
        banner_image: 'https://picsum.photos/seed/art-banner/800/300',
        logo: 'https://picsum.photos/seed/art-logo/100/100',
        is_public: true,
        category: 'art',
        location: 'San Francisco, CA',
        website: 'https://artculture.com',
        social_links: { twitter: '@artculture', instagram: '@artculture' },
        guidelines: 'Share beautiful art, respect different perspectives, and celebrate creativity!',
        tags: ['art', 'culture', 'galleries', 'museums']
      }
    ];
    
    const { data: insertedHubs, error: insertError } = await supabase
      .from('community_hubs')
      .insert(testCommunities)
      .select();
    
    if (insertError) {
      console.log('❌ Error creating communities:', insertError.message);
      return;
    }
    
    console.log('✅ Created test communities:');
    insertedHubs.forEach(hub => {
      console.log(`- ${hub.name} (${hub.slug}) - ID: ${hub.id}`);
    });
    
    // Now test the community detail page
    console.log('\n🧪 Testing community detail page...');
    const testSlug = insertedHubs[0].slug;
    console.log(`Testing with slug: ${testSlug}`);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createTestCommunities();

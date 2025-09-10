import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEventsWithCorrectFields() {
  console.log('🔄 Updating events with correct field names...');
  
  try {
    // Get all events
    const { data: events, error: fetchError } = await supabase
      .from('events')
      .select('id, title, start_datetime, end_datetime');
    
    if (fetchError) {
      console.error('❌ Error fetching events:', fetchError);
      return;
    }
    
    console.log(`📅 Found ${events.length} events to update`);
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const now = new Date();
      const isUpcoming = i % 2 === 0;
      
      let startDate, endDate;
      if (isUpcoming) {
        const daysFromNow = 30 + (i * 7);
        startDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
        endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000));
      } else {
        const daysAgo = 30 + (i * 7);
        startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000));
      }
      
      const { error: updateError } = await supabase
        .from('events')
        .update({
          start_datetime: startDate.toISOString(),
          end_datetime: endDate.toISOString(),
          description: `Join us for ${event.title}! This ${isUpcoming ? 'upcoming' : 'past'} event promises to be an unforgettable experience with amazing performances, great food, and wonderful people.`,
          category: ['music', 'sports', 'business', 'entertainment', 'arts', 'food_drink', 'community', 'education'][i % 8],
          tags: [
            ['live music', 'concert', 'band'],
            ['sports', 'game', 'tournament'],
            ['networking', 'business', 'conference'],
            ['comedy', 'show', 'entertainment'],
            ['art', 'exhibition', 'gallery'],
            ['food', 'wine', 'tasting'],
            ['community', 'local', 'meetup'],
            ['learning', 'workshop', 'education']
          ][i % 8],
          image_url: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
          gallery_images: [
            `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000) + 1}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000) + 2}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
          ],
          ticket_price: Math.floor(Math.random() * 100) + 10,
          price_min: Math.floor(Math.random() * 50) + 5,
          price_max: Math.floor(Math.random() * 200) + 50,
          capacity: Math.floor(Math.random() * 500) + 50,
          tickets_sold: Math.floor(Math.random() * 50),
          is_featured: i < 3,
          location_name: `Venue ${i + 1}`,
          location_address: `${100 + i * 10} Main Street`,
          status: 'published',
          visibility: 'public'
        })
        .eq('id', event.id);
      
      if (updateError) {
        console.error(`❌ Error updating event ${event.title}:`, updateError);
      } else {
        console.log(`✅ Updated ${event.title} with correct field names`);
      }
    }
    
    console.log('🎉 Events update completed!');
    
    // Test the updated data
    const { data: testEvents } = await supabase
      .from('events')
      .select('id, title, start_datetime, end_datetime, description, category, tags, image_url, is_featured, location_name, status')
      .limit(3);
    
    console.log('📊 Sample updated events:');
    testEvents?.forEach(event => {
      console.log(`- ${event.title}: ${event.start_datetime ? 'Has start_datetime' : 'No start_datetime'} | ${event.description ? 'Has description' : 'No description'} | ${event.image_url ? 'Has image' : 'No image'}`);
    });
    
  } catch (err) {
    console.error('❌ Update failed:', err);
  }
}

updateEventsWithCorrectFields();

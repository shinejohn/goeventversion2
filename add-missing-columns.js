import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMissingColumns() {
  console.log('🔧 Adding missing columns to match UI requirements...');
  
  try {
    // First, let's check what columns currently exist
    console.log('📋 Checking current table structure...');
    
    // Test what columns exist in events table
    const { data: eventsTest, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (eventsError) {
      console.log('Events table error:', eventsError.message);
    } else {
      console.log('Events table columns:', Object.keys(eventsTest[0] || {}));
    }
    
    // Test what columns exist in venues table
    const { data: venuesTest, error: venuesError } = await supabase
      .from('venues')
      .select('*')
      .limit(1);
    
    if (venuesError) {
      console.log('Venues table error:', venuesError.message);
    } else {
      console.log('Venues table columns:', Object.keys(venuesTest[0] || {}));
    }
    
    // Test what columns exist in performers table
    const { data: performersTest, error: performersError } = await supabase
      .from('performers')
      .select('*')
      .limit(1);
    
    if (performersError) {
      console.log('Performers table error:', performersError.message);
    } else {
      console.log('Performers table columns:', Object.keys(performersTest[0] || {}));
    }
    
    // Now let's update the data with the fields that do exist
    console.log('📊 Updating existing data...');
    
    // Update events with available fields
    const { data: events } = await supabase.from('events').select('id, title, start_date, end_date').limit(10);
    
    if (events) {
      console.log(`Found ${events.length} events to update`);
      
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
        
        // Update with fields that exist
        const updateData = {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
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
          is_featured: i < 3,
          location_name: `Venue ${i + 1}`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Nashville', 'Boston'][i % 8],
          status: 'published'
        };
        
        const { error } = await supabase
          .from('events')
          .update(updateData)
          .eq('id', event.id);
        
        if (error) {
          console.log(`⚠️  Event ${event.title} update error:`, error.message);
        } else {
          console.log(`✅ Updated event ${event.title}`);
        }
      }
    }
    
    // Update venues with available fields
    const { data: venues } = await supabase.from('venues').select('id, name').limit(10);
    
    if (venues) {
      console.log(`Found ${venues.length} venues to update`);
      
      for (let i = 0; i < venues.length; i++) {
        const venue = venues[i];
        
        const updateData = {
          description: `Beautiful venue perfect for ${['concerts', 'conferences', 'parties', 'weddings', 'corporate events'][i % 5]}. Features state-of-the-art facilities and professional staff.`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Nashville', 'Boston'][i % 8],
          image_url: `https://images.unsplash.com/photo-${1600000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
          gallery_images: [
            `https://images.unsplash.com/photo-${1600000000000 + (i * 1000000) + 1}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            `https://images.unsplash.com/photo-${1600000000000 + (i * 1000000) + 2}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
          ],
          max_capacity: Math.floor(Math.random() * 1000) + 100,
          is_verified: Math.random() > 0.3,
          is_active: true
        };
        
        const { error } = await supabase
          .from('venues')
          .update(updateData)
          .eq('id', venue.id);
        
        if (error) {
          console.log(`⚠️  Venue ${venue.name} update error:`, error.message);
        } else {
          console.log(`✅ Updated venue ${venue.name}`);
        }
      }
    }
    
    // Update performers with available fields
    const { data: performers } = await supabase.from('performers').select('id, name').limit(10);
    
    if (performers) {
      console.log(`Found ${performers.length} performers to update`);
      
      for (let i = 0; i < performers.length; i++) {
        const performer = performers[i];
        
        const updateData = {
          bio: `Professional ${['Band', 'Solo Artist', 'DJ', 'Comedian', 'Dancer', 'Magician', 'Speaker', 'Musician'][i % 8].toLowerCase()} with ${Math.floor(Math.random() * 20) + 5} years of experience in live performances.`,
          category: ['Band', 'Solo Artist', 'DJ', 'Comedian', 'Dancer', 'Magician', 'Speaker', 'Musician'][i % 8],
          genres: [
            ['Rock', 'Jazz'],
            ['Electronic', 'Hip-Hop'],
            ['Classical', 'Blues'],
            ['Country', 'Pop'],
            ['Folk', 'Indie'],
            ['R&B', 'Soul'],
            ['Reggae', 'Funk'],
            ['Alternative', 'Punk']
          ][i % 8],
          image: `https://images.unsplash.com/photo-${1700000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
          verified: Math.random() > 0.4,
          city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Nashville', 'Boston'][i % 8]
        };
        
        const { error } = await supabase
          .from('performers')
          .update(updateData)
          .eq('id', performer.id);
        
        if (error) {
          console.log(`⚠️  Performer ${performer.name} update error:`, error.message);
        } else {
          console.log(`✅ Updated performer ${performer.name}`);
        }
      }
    }
    
    console.log('🎉 Data update completed! Now testing the application...');
    
    // Test the updated data
    const { data: testEvents } = await supabase
      .from('events')
      .select('id, title, start_date, end_date, description, category, tags, image_url, is_featured, location_name, city, status')
      .limit(3);
    
    console.log('📊 Sample updated events:');
    testEvents?.forEach(event => {
      console.log(`- ${event.title}: ${event.start_date ? 'Has dates' : 'No dates'} | ${event.description ? 'Has description' : 'No description'} | ${event.image_url ? 'Has image' : 'No image'}`);
    });
    
  } catch (err) {
    console.error('❌ Update failed:', err);
  }
}

addMissingColumns();

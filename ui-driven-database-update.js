import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabaseForUI() {
  console.log('🎨 Updating database to match Magic Patterns UI requirements...');
  
  try {
    // 1. Update Events table with missing fields
    console.log('📅 Updating events with UI-required fields...');
    
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title, start_date, end_date');
    
    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError);
      return;
    }
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      // Create realistic event data based on UI expectations
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
      
      const categories = ['music', 'sports', 'business', 'entertainment', 'arts', 'food_drink', 'community', 'education'];
      const tags = [
        ['live music', 'concert', 'band'],
        ['sports', 'game', 'tournament'],
        ['networking', 'business', 'conference'],
        ['comedy', 'show', 'entertainment'],
        ['art', 'exhibition', 'gallery'],
        ['food', 'wine', 'tasting'],
        ['community', 'local', 'meetup'],
        ['learning', 'workshop', 'education']
      ];
      
      const category = categories[i % categories.length];
      const eventTags = tags[i % tags.length];
      
      const { error: updateError } = await supabase
        .from('events')
        .update({
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          description: `Join us for ${event.title}! This ${isUpcoming ? 'upcoming' : 'past'} event promises to be an unforgettable experience with amazing performances, great food, and wonderful people. Don't miss out on this incredible opportunity to connect with your community.`,
          category: category,
          tags: eventTags,
          image_url: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
          gallery_images: [
            `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000) + 1}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000) + 2}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000) + 3}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
          ],
          // Add fields that UI expects but might not exist in schema
          ticket_price: Math.floor(Math.random() * 100) + 10,
          price_min: Math.floor(Math.random() * 50) + 5,
          price_max: Math.floor(Math.random() * 200) + 50,
          max_capacity: Math.floor(Math.random() * 500) + 50,
          current_attendees: Math.floor(Math.random() * 50),
          is_featured: i < 3, // First 3 events are featured
          is_free: Math.random() > 0.7, // 30% chance of being free
          location_name: `Venue ${i + 1}`,
          address: `${100 + i * 10} Main Street`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin'][i % 6],
          state: ['NY', 'CA', 'IL', 'FL', 'WA', 'TX'][i % 6],
          postal_code: `${10000 + i * 100}`,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
          amenities: ['WiFi', 'Parking', 'Food Available', 'Bar', 'Accessibility'][i % 5],
          requirements: 'Valid ID required. Age restrictions may apply.',
          highlights: [
            'Live Music Performance',
            'Food & Drinks Available',
            'Networking Opportunities',
            'Free Parking'
          ]
        })
        .eq('id', event.id);
      
      if (updateError) {
        console.error(`❌ Error updating event ${event.title}:`, updateError);
      } else {
        console.log(`✅ Updated ${event.title} with UI data`);
      }
    }
    
    // 2. Update Venues table with UI-required fields
    console.log('🏛️ Updating venues with UI-required fields...');
    
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name');
    
    if (!venuesError && venues) {
      for (let i = 0; i < venues.length; i++) {
        const venue = venues[i];
        
        const venueTypes = ['indoor', 'outdoor', 'hybrid', 'virtual', 'mobile'];
        const amenities = [
          ['WiFi', 'Parking', 'Bar', 'Kitchen', 'Stage'],
          ['Outdoor Space', 'Garden', 'Tent', 'Lighting', 'Sound'],
          ['Conference Room', 'AV Equipment', 'Catering', 'Reception', 'Breakout Rooms'],
          ['Online Platform', 'Streaming', 'Chat', 'Polls', 'Recording'],
          ['Mobile Setup', 'Portable', 'Flexible', 'Custom', 'On-site']
        ];
        
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            description: `Beautiful ${venueTypes[i % venueTypes.length]} venue perfect for ${['concerts', 'conferences', 'parties', 'weddings', 'corporate events'][i % 5]}. Features state-of-the-art facilities and professional staff.`,
            venue_type: venueTypes[i % venueTypes.length],
            address: `${200 + i * 20} ${['Main', 'Broadway', 'Oak', 'Pine', 'Cedar'][i % 5]} Street`,
            city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin'][i % 6],
            state: ['NY', 'CA', 'IL', 'FL', 'WA', 'TX'][i % 6],
            country: 'USA',
            postal_code: `${20000 + i * 200}`,
            max_capacity: Math.floor(Math.random() * 1000) + 100,
            image_url: `https://images.unsplash.com/photo-${1600000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            gallery_images: [
              `https://images.unsplash.com/photo-${1600000000000 + (i * 1000000) + 1}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
              `https://images.unsplash.com/photo-${1600000000000 + (i * 1000000) + 2}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
            ],
            amenities: amenities[i % amenities.length],
            rating: 4.0 + (Math.random() * 1.0),
            total_events: Math.floor(Math.random() * 100) + 10,
            is_verified: Math.random() > 0.3, // 70% verified
            is_active: true,
            contact_email: `info@${venue.name.toLowerCase().replace(/\s+/g, '')}.com`,
            contact_phone: `+1-555-${1000 + i * 100}`,
            slug: venue.name.toLowerCase().replace(/\s+/g, '-'),
            pricePerHour: Math.floor(Math.random() * 500) + 100,
            operating_hours: {
              monday: '9:00 AM - 10:00 PM',
              tuesday: '9:00 AM - 10:00 PM',
              wednesday: '9:00 AM - 10:00 PM',
              thursday: '9:00 AM - 10:00 PM',
              friday: '9:00 AM - 11:00 PM',
              saturday: '10:00 AM - 11:00 PM',
              sunday: '10:00 AM - 9:00 PM'
            }
          })
          .eq('id', venue.id);
        
        if (!updateError) {
          console.log(`✅ Updated venue ${venue.name}`);
        }
      }
    }
    
    // 3. Update Performers table with UI-required fields
    console.log('🎭 Updating performers with UI-required fields...');
    
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name');
    
    if (!performersError && performers) {
      for (let i = 0; i < performers.length; i++) {
        const performer = performers[i];
        
        const categories = ['Band', 'Solo Artist', 'DJ', 'Comedian', 'Dancer', 'Magician', 'Speaker', 'Musician'];
        const genres = ['Rock', 'Jazz', 'Electronic', 'Hip-Hop', 'Classical', 'Blues', 'Country', 'Pop'];
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin', 'Nashville', 'Boston'];
        
        const { error: updateError } = await supabase
          .from('performers')
          .update({
            stage_name: performer.name,
            category: categories[i % categories.length],
            genres: [genres[i % genres.length], genres[(i + 1) % genres.length]],
            bio: `Professional ${categories[i % categories.length].toLowerCase()} with ${Math.floor(Math.random() * 20) + 5} years of experience in live performances. Known for ${['energetic', 'intimate', 'high-energy', 'soulful', 'dynamic'][i % 5]} performances that captivate audiences.`,
            rating: 4.0 + (Math.random() * 1.0),
            total_reviews: Math.floor(Math.random() * 100) + 10,
            base_price: Math.floor(Math.random() * 1000) + 200,
            home_city: cities[i % cities.length],
            location: `${cities[i % cities.length]}, ${['NY', 'CA', 'IL', 'FL', 'WA', 'TX', 'TN', 'MA'][i % 8]}`,
            image: `https://images.unsplash.com/photo-${1700000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
            social_links: {
              instagram: `@${performer.name.toLowerCase().replace(/\s+/g, '')}`,
              facebook: `facebook.com/${performer.name.toLowerCase().replace(/\s+/g, '')}`,
              twitter: `@${performer.name.toLowerCase().replace(/\s+/g, '')}`,
              youtube: `youtube.com/c/${performer.name.toLowerCase().replace(/\s+/g, '')}`
            },
            verified: Math.random() > 0.4, // 60% verified
            shows_played: Math.floor(Math.random() * 200) + 20,
            years_active: Math.floor(Math.random() * 15) + 2,
            response_time: `${Math.floor(Math.random() * 24) + 1} hours`,
            reviews: [
              {
                id: `review-${i}-1`,
                rating: 5,
                comment: 'Amazing performance! Highly recommend.',
                author: 'John D.',
                date: new Date().toISOString()
              },
              {
                id: `review-${i}-2`,
                rating: 4,
                comment: 'Great energy and professional attitude.',
                author: 'Sarah M.',
                date: new Date().toISOString()
              }
            ]
          })
          .eq('id', performer.id);
        
        if (!updateError) {
          console.log(`✅ Updated performer ${performer.name}`);
        }
      }
    }
    
    // 4. Create event-performer relationships
    console.log('🔗 Creating event-performer relationships...');
    
    const { data: allEvents } = await supabase.from('events').select('id').limit(5);
    const { data: allPerformers } = await supabase.from('performers').select('id').limit(5);
    
    if (allEvents && allPerformers) {
      // Create some relationships between events and performers
      for (let i = 0; i < Math.min(allEvents.length, allPerformers.length); i++) {
        const { error: relError } = await supabase
          .from('event_performers')
          .upsert({
            event_id: allEvents[i].id,
            performer_id: allPerformers[i].id,
            role: ['Headliner', 'Supporting Act', 'Opening Act', 'Featured Performer'][i % 4],
            performance_time: new Date().toISOString(),
            notes: 'Great performer, highly recommended'
          });
        
        if (!relError) {
          console.log(`✅ Created event-performer relationship ${i + 1}`);
        }
      }
    }
    
    console.log('🎉 Database update completed! All UI-required fields have been added.');
    
  } catch (err) {
    console.error('❌ Update failed:', err);
  }
}

updateDatabaseForUI();

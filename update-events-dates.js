import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEventsWithDates() {
  console.log('🔄 Updating events with proper dates...');
  
  try {
    // Get all events
    const { data: events, error: fetchError } = await supabase
      .from('events')
      .select('id, title');
    
    if (fetchError) {
      console.error('❌ Error fetching events:', fetchError);
      return;
    }
    
    console.log(`📅 Found ${events.length} events to update`);
    
    // Update each event with proper dates
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      // Create dates: some in the past, some upcoming
      const now = new Date();
      const isUpcoming = i % 2 === 0; // Alternate between past and upcoming
      
      let startDate, endDate;
      
      if (isUpcoming) {
        // Upcoming events (next 30-90 days)
        const daysFromNow = 30 + (i * 7);
        startDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
        endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
      } else {
        // Past events (30-90 days ago)
        const daysAgo = 30 + (i * 7);
        startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
      }
      
      const { error: updateError } = await supabase
        .from('events')
        .update({
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          description: `Description for ${event.title} - ${isUpcoming ? 'Upcoming' : 'Past'} event`,
          category: ['music', 'sports', 'business', 'entertainment', 'arts'][i % 5],
          base_price: Math.floor(Math.random() * 100) + 10,
          max_capacity: Math.floor(Math.random() * 500) + 50,
          current_bookings: Math.floor(Math.random() * 50),
          image_url: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
        })
        .eq('id', event.id);
      
      if (updateError) {
        console.error(`❌ Error updating event ${event.title}:`, updateError);
      } else {
        console.log(`✅ Updated ${event.title} (${isUpcoming ? 'upcoming' : 'past'})`);
      }
    }
    
    console.log('🎉 Events update completed!');
    
    // Also update performers with better data
    console.log('🎭 Updating performers...');
    
    const { data: performers, error: performersError } = await supabase
      .from('performers')
      .select('id, name');
    
    if (!performersError && performers) {
      for (let i = 0; i < performers.length; i++) {
        const performer = performers[i];
        const categories = ['Band', 'Solo Artist', 'DJ', 'Comedian', 'Dancer'];
        const genres = ['Rock', 'Jazz', 'Electronic', 'Hip-Hop', 'Classical'];
        
        const { error: updateError } = await supabase
          .from('performers')
          .update({
            stage_name: performer.name,
            category: categories[i % categories.length],
            genres: [genres[i % genres.length]],
            bio: `Professional ${categories[i % categories.length].toLowerCase()} with years of experience in live performances.`,
            rating: 4.0 + (Math.random() * 1.0),
            total_reviews: Math.floor(Math.random() * 50) + 5,
            base_price: Math.floor(Math.random() * 500) + 100,
            home_city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'][i % 5],
            image: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
          })
          .eq('id', performer.id);
        
        if (!updateError) {
          console.log(`✅ Updated performer ${performer.name}`);
        }
      }
    }
    
    console.log('🎉 All updates completed!');
    
  } catch (err) {
    console.error('❌ Update failed:', err);
  }
}

updateEventsWithDates();

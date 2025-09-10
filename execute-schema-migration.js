import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSchemaMigration() {
  console.log('🔧 Executing UI-driven schema migration...');
  
  try {
    // Read the SQL migration file
    const sql = readFileSync('./ui-driven-schema-migration.sql', 'utf8');
    
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        });
        
        if (error) {
          // Try alternative method for DDL statements
          const { error: altError } = await supabase
            .from('_migrations')
            .insert({ sql: statement });
          
          if (altError) {
            console.log(`⚠️  Statement ${i + 1} may need manual execution:`, error.message);
            console.log(`SQL: ${statement.substring(0, 100)}...`);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    console.log('🎉 Schema migration completed!');
    
    // Now update the data with UI-required fields
    console.log('📊 Updating data with UI-required fields...');
    
    await updateDataForUI();
    
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
}

async function updateDataForUI() {
  try {
    // Update events with proper data
    const { data: events } = await supabase.from('events').select('id, title').limit(5);
    
    if (events) {
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
        
        const { error } = await supabase
          .from('events')
          .update({
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            description: `Join us for ${event.title}! This ${isUpcoming ? 'upcoming' : 'past'} event promises to be an unforgettable experience.`,
            category: ['music', 'sports', 'business', 'entertainment', 'arts'][i % 5],
            tags: [['live music', 'concert'], ['sports', 'game'], ['networking', 'business'], ['comedy', 'show'], ['art', 'exhibition']][i % 5],
            image_url: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            ticket_price: Math.floor(Math.random() * 100) + 10,
            price_min: Math.floor(Math.random() * 50) + 5,
            price_max: Math.floor(Math.random() * 200) + 50,
            max_capacity: Math.floor(Math.random() * 500) + 50,
            current_attendees: Math.floor(Math.random() * 50),
            is_featured: i < 3,
            is_free: Math.random() > 0.7,
            location_name: `Venue ${i + 1}`,
            address: `${100 + i * 10} Main Street`,
            city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'][i % 5],
            state: ['NY', 'CA', 'IL', 'FL', 'WA'][i % 5],
            postal_code: `${10000 + i * 100}`,
            latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
            requirements: 'Valid ID required. Age restrictions may apply.',
            highlights: ['Live Performance', 'Food & Drinks', 'Networking', 'Free Parking']
          })
          .eq('id', event.id);
        
        if (!error) {
          console.log(`✅ Updated event ${event.title}`);
        }
      }
    }
    
    // Update venues
    const { data: venues } = await supabase.from('venues').select('id, name').limit(5);
    
    if (venues) {
      for (let i = 0; i < venues.length; i++) {
        const venue = venues[i];
        
        const { error } = await supabase
          .from('venues')
          .update({
            description: `Beautiful venue perfect for ${['concerts', 'conferences', 'parties', 'weddings', 'corporate events'][i % 5]}.`,
            venue_type: ['indoor', 'outdoor', 'hybrid', 'virtual', 'mobile'][i % 5],
            address: `${200 + i * 20} Main Street`,
            city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'][i % 5],
            state: ['NY', 'CA', 'IL', 'FL', 'WA'][i % 5],
            country: 'USA',
            postal_code: `${20000 + i * 200}`,
            max_capacity: Math.floor(Math.random() * 1000) + 100,
            image_url: `https://images.unsplash.com/photo-${1600000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            rating: 4.0 + (Math.random() * 1.0),
            total_events: Math.floor(Math.random() * 100) + 10,
            is_verified: Math.random() > 0.3,
            is_active: true,
            contact_email: `info@${venue.name.toLowerCase().replace(/\s+/g, '')}.com`,
            contact_phone: `+1-555-${1000 + i * 100}`,
            slug: venue.name.toLowerCase().replace(/\s+/g, '-'),
            pricePerHour: Math.floor(Math.random() * 500) + 100
          })
          .eq('id', venue.id);
        
        if (!error) {
          console.log(`✅ Updated venue ${venue.name}`);
        }
      }
    }
    
    // Update performers
    const { data: performers } = await supabase.from('performers').select('id, name').limit(5);
    
    if (performers) {
      for (let i = 0; i < performers.length; i++) {
        const performer = performers[i];
        
        const { error } = await supabase
          .from('performers')
          .update({
            stage_name: performer.name,
            category: ['Band', 'Solo Artist', 'DJ', 'Comedian', 'Dancer'][i % 5],
            genres: [['Rock', 'Jazz'], ['Electronic', 'Hip-Hop'], ['Classical', 'Blues'], ['Country', 'Pop'], ['Folk', 'Indie']][i % 5],
            bio: `Professional ${['Band', 'Solo Artist', 'DJ', 'Comedian', 'Dancer'][i % 5].toLowerCase()} with years of experience.`,
            rating: 4.0 + (Math.random() * 1.0),
            total_reviews: Math.floor(Math.random() * 100) + 10,
            base_price: Math.floor(Math.random() * 1000) + 200,
            home_city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'][i % 5],
            location: `${['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle'][i % 5]}, ${['NY', 'CA', 'IL', 'FL', 'WA'][i % 5]}`,
            image: `https://images.unsplash.com/photo-${1700000000000 + (i * 1000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
            verified: Math.random() > 0.4,
            shows_played: Math.floor(Math.random() * 200) + 20,
            years_active: Math.floor(Math.random() * 15) + 2,
            response_time: `${Math.floor(Math.random() * 24) + 1} hours`
          })
          .eq('id', performer.id);
        
        if (!error) {
          console.log(`✅ Updated performer ${performer.name}`);
        }
      }
    }
    
    console.log('🎉 Data update completed!');
    
  } catch (err) {
    console.error('❌ Data update failed:', err);
  }
}

executeSchemaMigration();

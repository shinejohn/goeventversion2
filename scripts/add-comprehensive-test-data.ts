#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODAzOTUsImV4cCI6MjA3MjI1NjM5NX0.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestData() {
  console.log('Adding comprehensive test data...\n');
  
  // First, check what exists
  const { data: existingVenues } = await supabase.from('venues').select('id, name').limit(5);
  const { data: existingEvents } = await supabase.from('events').select('id, title').limit(5);
  
  console.log('Existing venues:', existingVenues?.length || 0);
  console.log('Existing events:', existingEvents?.length || 0);
  
  // Add test venues if needed
  if (!existingVenues || existingVenues.length < 5) {
    console.log('\nAdding test venues...');
    
    const venues = [
      {
        name: 'The Grand Theater',
        category: 'theater',
        address: '123 Main St, Clearwater, FL 33756',
        city: 'Clearwater',
        state: 'Florida',
        capacity: 500,
        max_capacity: 500,
        description: 'Historic downtown theater featuring live performances and concerts',
        image_url: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop',
        amenities: ['Parking', 'Bar', 'Wheelchair Accessible', 'VIP Seating'],
        price_min: 100,
        price_max: 500,
        rating: 4.5,
        is_active: true
      },
      {
        name: 'Sunset Beach Pavilion',
        category: 'outdoor',
        address: '456 Beach Blvd, Clearwater Beach, FL 33767',
        city: 'Clearwater Beach',
        state: 'Florida',
        capacity: 1000,
        max_capacity: 1000,
        description: 'Beachfront venue perfect for concerts and festivals',
        image_url: 'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=800&h=600&fit=crop',
        amenities: ['Parking', 'Food Vendors', 'Beach Access', 'Sound System'],
        price_min: 200,
        price_max: 1000,
        rating: 4.8,
        is_active: true
      },
      {
        name: 'Jazz Corner Club',
        category: 'club',
        address: '789 Jazz Alley, Tampa, FL 33602',
        city: 'Tampa',
        state: 'Florida',
        capacity: 200,
        max_capacity: 200,
        description: 'Intimate jazz club with nightly performances',
        image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
        amenities: ['Bar', 'VIP Tables', 'Stage Lighting', 'Premium Sound'],
        price_min: 50,
        price_max: 200,
        rating: 4.7,
        is_active: true
      },
      {
        name: 'Community Arts Center',
        category: 'community-center',
        address: '321 Arts Way, St. Petersburg, FL 33701',
        city: 'St. Petersburg',
        state: 'Florida',
        capacity: 300,
        max_capacity: 300,
        description: 'Multi-purpose venue for community events and performances',
        image_url: 'https://images.unsplash.com/photo-1555597906-44a7f7e3e0e5?w=800&h=600&fit=crop',
        amenities: ['Parking', 'Kitchen', 'Multiple Rooms', 'AV Equipment'],
        price_min: 75,
        price_max: 300,
        rating: 4.3,
        is_active: true
      },
      {
        name: 'The Rooftop Lounge',
        category: 'bar',
        address: '555 Sky High Ave, Tampa, FL 33605',
        city: 'Tampa',
        state: 'Florida',
        capacity: 150,
        max_capacity: 150,
        description: 'Upscale rooftop venue with city views',
        image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
        amenities: ['Full Bar', 'Kitchen', 'City Views', 'Heating/Cooling'],
        price_min: 150,
        price_max: 400,
        rating: 4.6,
        is_active: true
      }
    ];
    
    const { data: insertedVenues, error: venueError } = await supabase
      .from('venues')
      .upsert(venues, { onConflict: 'name' })
      .select();
      
    if (venueError) {
      console.error('Error adding venues:', venueError);
    } else {
      console.log('Added', insertedVenues?.length, 'venues');
    }
  }
  
  // Add test performers
  console.log('\nAdding test performers...');
  
  const performers = [
    {
      name: 'The Clearwater Band',
      stage_name: 'The Clearwater Band',
      category: 'band',
      genres: ['Rock', 'Pop', 'Alternative'],
      bio: 'Local favorite band bringing high energy performances to the Tampa Bay area',
      profile_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      rating: 4.8,
      average_rating: 4.8,
      is_verified: true,
      city: 'Clearwater',
      total_performances: 150
    },
    {
      name: 'Sarah Johnson',
      stage_name: 'Sarah J',
      category: 'solo-artist',
      genres: ['Jazz', 'Soul', 'R&B'],
      bio: 'Soulful vocalist with a passion for jazz standards and modern R&B',
      profile_image_url: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=800&h=600&fit=crop',
      rating: 4.9,
      average_rating: 4.9,
      is_verified: true,
      city: 'Tampa',
      total_performances: 200
    },
    {
      name: 'DJ Mike Storm',
      stage_name: 'DJ Storm',
      category: 'dj',
      genres: ['Electronic', 'House', 'Hip-Hop'],
      bio: 'Premier DJ spinning the hottest tracks for clubs and events',
      profile_image_url: 'https://images.unsplash.com/photo-1571266028243-2af49d40e18f?w=800&h=600&fit=crop',
      rating: 4.5,
      average_rating: 4.5,
      is_verified: true,
      city: 'St. Petersburg',
      total_performances: 300
    },
    {
      name: 'The Comedy Crew',
      stage_name: 'Comedy Crew',
      category: 'comedian',
      genres: ['Stand-up', 'Improv', 'Sketch'],
      bio: 'Hilarious comedy troupe guaranteed to make you laugh',
      profile_image_url: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&h=600&fit=crop',
      rating: 4.7,
      average_rating: 4.7,
      is_verified: true,
      city: 'Tampa',
      total_performances: 100
    },
    {
      name: 'Classical Strings Quartet',
      stage_name: 'Classical Strings',
      category: 'band',
      genres: ['Classical', 'Chamber Music', 'Contemporary'],
      bio: 'Professional string quartet for elegant events',
      profile_image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop',
      rating: 5.0,
      average_rating: 5.0,
      is_verified: true,
      city: 'Clearwater',
      total_performances: 250
    }
  ];
  
  const { data: insertedPerformers, error: performerError } = await supabase
    .from('performers')
    .upsert(performers, { onConflict: 'name' })
    .select();
    
  if (performerError) {
    console.error('Error adding performers:', performerError);
  } else {
    console.log('Added', insertedPerformers?.length, 'performers');
  }
  
  // Add sponsors and organizers first
  console.log('\nAdding sponsors and organizers...');
  
  const sponsors = [
    {
      name: 'City of Clearwater',
      slug: 'city-of-clearwater',
      category: 'government',
      description: 'Clearwater city government',
      website: 'https://www.myclearwater.com'
    },
    {
      name: 'Friends of Clearwater Library',
      slug: 'friends-clearwater-library',
      category: 'nonprofit',
      description: 'Supporting literacy and community programs',
      contact_email: 'friends@clearwaterlibrary.org'
    }
  ];
  
  const organizers = [
    {
      name: 'City Commissioners',
      slug: 'city-commissioners',
      category: 'government',
      description: 'Elected city officials'
    },
    {
      name: 'Library Volunteers',
      slug: 'library-volunteers',
      category: 'community-group',
      description: 'Volunteer group organizing library events'
    }
  ];
  
  const { data: insertedSponsors } = await supabase
    .from('sponsors')
    .upsert(sponsors, { onConflict: 'slug' })
    .select();
    
  const { data: insertedOrganizers } = await supabase
    .from('organizers')
    .upsert(organizers, { onConflict: 'slug' })
    .select();
  
  console.log('Added sponsors:', insertedSponsors?.length);
  console.log('Added organizers:', insertedOrganizers?.length);

  // Add event series
  console.log('\nAdding event series...');
  
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const series = [
    {
      name: 'Clearwater Jazz Festival',
      slug: 'clearwater-jazz-festival',
      series_type: 'festival',
      description: 'Annual jazz festival featuring world-class performers',
      start_date: new Date(nextMonth).toISOString().split('T')[0],
      end_date: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_recurring: true,
      recurrence_pattern: 'annual',
      logo_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      total_events: 12,
      is_active: true,
      tags: ['Jazz', 'Music', 'Festival', 'Annual']
    },
    {
      name: 'Tampa Bay Tech Conference',
      slug: 'tampa-tech-conference',
      series_type: 'conference',
      description: 'Premier technology conference for the Tampa Bay area',
      start_date: new Date(nextWeek).toISOString().split('T')[0],
      end_date: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_recurring: true,
      recurrence_pattern: 'annual',
      total_events: 15,
      is_active: true,
      tags: ['Technology', 'Conference', 'Professional']
    },
    {
      name: 'Summer Concert Series',
      slug: 'summer-concert-series',
      series_type: 'program',
      description: 'Weekly concerts at various venues throughout the summer',
      is_recurring: true,
      recurrence_pattern: 'annual',
      total_events: 10,
      is_active: true,
      tags: ['Music', 'Summer', 'Community']
    }
  ];
  
  const { data: insertedSeries } = await supabase
    .from('event_series')
    .upsert(series, { onConflict: 'slug' })
    .select();
    
  console.log('Added series:', insertedSeries?.length);

  // Get venue and performer IDs for creating events
  const { data: allVenues } = await supabase.from('venues').select('id, name');
  const { data: allPerformers } = await supabase.from('performers').select('id, name');
  const { data: allSponsors } = await supabase.from('sponsors').select('id, name');
  const { data: allOrganizers } = await supabase.from('organizers').select('id, name');
  const { data: allSeries } = await supabase.from('event_series').select('id, name');
  
  if (allVenues) {
    // Add test events
    console.log('\nAdding test events...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const events = [
      {
        title: 'Summer Rock Festival',
        category: 'concert',
        genre: 'Rock',
        description: 'Annual summer rock festival featuring local and touring bands',
        venue_id: allVenues[1]?.id, // Sunset Beach Pavilion
        start_datetime: tomorrow.toISOString(),
        end_datetime: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
        price: 50,
        status: 'upcoming',
        tags: ['Music', 'Festival', 'Outdoor'],
        address: allVenues[1]?.address || '456 Beach Blvd, Clearwater Beach, FL',
        city: 'Clearwater Beach',
        state: 'Florida',
        max_capacity: 1000
      },
      {
        title: 'Jazz Night with Sarah J',
        category: 'concert',
        genre: 'Jazz',
        description: 'An intimate evening of jazz standards and soul',
        venue_id: allVenues[2]?.id, // Jazz Corner Club
        start_datetime: nextWeek.toISOString(),
        end_datetime: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
        price: 35,
        status: 'upcoming',
        tags: ['Jazz', 'Live Music', 'Intimate'],
        address: allVenues[2]?.address || '789 Jazz Alley, Tampa, FL',
        city: 'Tampa',
        state: 'Florida',
        max_capacity: 200
      },
      {
        title: 'Shakespeare in the Park',
        category: 'theater',
        genre: 'Theater',
        description: 'Classic Shakespeare performed under the stars',
        venue_id: allVenues[0]?.id, // The Grand Theater
        start_datetime: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_datetime: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
        price: 25,
        status: 'upcoming',
        tags: ['Theater', 'Classic', 'Family'],
        address: allVenues[0]?.address || '123 Main St, Clearwater, FL',
        city: 'Clearwater',
        state: 'Florida',
        max_capacity: 500
      },
      {
        title: 'Saturday Night Dance Party',
        category: 'club-night',
        genre: 'Electronic',
        description: 'DJ Storm spins the hottest tracks all night long',
        venue_id: allVenues[4]?.id, // The Rooftop Lounge
        start_datetime: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        end_datetime: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop',
        price: 20,
        status: 'upcoming',
        tags: ['DJ', 'Dancing', 'Nightlife'],
        address: allVenues[4]?.address || '555 Sky High Ave, Tampa, FL',
        city: 'Tampa',
        state: 'Florida',
        max_capacity: 150
      },
      {
        title: 'Community Art Fair',
        category: 'festival',
        genre: 'Art',
        description: 'Local artists showcase their work with live music',
        venue_id: allVenues[3]?.id, // Community Arts Center
        start_datetime: nextMonth.toISOString(),
        end_datetime: new Date(nextMonth.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&h=600&fit=crop',
        price: 0,
        status: 'upcoming',
        tags: ['Art', 'Community', 'Free'],
        address: allVenues[3]?.address || '321 Arts Way, St. Petersburg, FL',
        city: 'St. Petersburg',
        state: 'Florida',
        max_capacity: 300
      },
      {
        title: 'City Commission Meeting',
        category: 'government',
        genre: 'Meeting',
        description: 'Monthly city commission meeting open to the public',
        venue_id: allVenues[0]?.id, // The Grand Theater (using as City Hall)
        sponsor_id: allSponsors?.find(s => s.name === 'City of Clearwater')?.id,
        organizer_id: allOrganizers?.find(o => o.name === 'City Commissioners')?.id,
        start_datetime: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_datetime: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&h=600&fit=crop',
        price: 0,
        status: 'upcoming',
        tags: ['Government', 'Public', 'Free'],
        address: allVenues[0]?.address || '123 Main St, Clearwater, FL',
        city: 'Clearwater',
        state: 'Florida',
        max_capacity: 500,
        is_meeting: true,
        meeting_number: '2024-03',
        requires_rsvp: false
      },
      {
        title: 'Library Book Sale',
        category: 'fundraiser',
        genre: 'Sale',
        description: 'Annual book sale fundraiser to support library programs',
        venue_id: allVenues[3]?.id, // Community Arts Center (as Library)
        sponsor_id: allSponsors?.find(s => s.name === 'Friends of Clearwater Library')?.id,
        organizer_id: allOrganizers?.find(o => o.name === 'Library Volunteers')?.id,
        start_datetime: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_datetime: new Date(nextMonth.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
        price: 0,
        status: 'upcoming',
        tags: ['Books', 'Fundraiser', 'Community'],
        address: allVenues[3]?.address || '321 Arts Way, St. Petersburg, FL',
        city: 'St. Petersburg',
        state: 'Florida',
        max_capacity: 200
      }
    ];
    
    const { data: insertedEvents, error: eventError } = await supabase
      .from('events')
      .upsert(events, { onConflict: 'title' })
      .select();
      
    if (eventError) {
      console.error('Error adding events:', eventError);
    } else {
      console.log('Added', insertedEvents?.length, 'events');
      
      // Link performers to events
      if (insertedEvents && allPerformers) {
        console.log('\nLinking performers to events...');
        
        const performerEvents = [
          {
            event_id: insertedEvents[0]?.id,
            performer_id: allPerformers[0]?.id, // The Clearwater Band at Summer Rock Festival
          },
          {
            event_id: insertedEvents[1]?.id,
            performer_id: allPerformers[1]?.id, // Sarah J at Jazz Night
          },
          {
            event_id: insertedEvents[3]?.id,
            performer_id: allPerformers[2]?.id, // DJ Storm at Dance Party
          }
        ];
        
        const { error: linkError } = await supabase
          .from('performers_events')
          .upsert(performerEvents, { onConflict: 'performer_id,event_id' });
          
        if (linkError) {
          console.error('Error linking performers:', linkError);
        } else {
          console.log('Linked performers to events');
        }
      }
    }
  }
  
  // Add some reviews
  console.log('\nAdding test reviews...');
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user && allVenues && allPerformers) {
    const reviews = [
      {
        reviewer_id: user.id,
        venue_id: allVenues[0]?.id,
        rating: 5,
        title: 'Amazing venue!',
        content: 'The Grand Theater is absolutely beautiful. Great acoustics and comfortable seating.'
      },
      {
        reviewer_id: user.id,
        performer_id: allPerformers[1]?.id,
        rating: 5,
        title: 'Incredible voice',
        content: 'Sarah J has such a soulful voice. Her performance was mesmerizing!'
      },
      {
        reviewer_id: user.id,
        venue_id: allVenues[2]?.id,
        rating: 4,
        title: 'Great jazz spot',
        content: 'Intimate setting perfect for jazz. The sound system is excellent.'
      }
    ];
    
    const { error: reviewError } = await supabase
      .from('reviews')
      .upsert(reviews);
      
    if (reviewError) {
      console.error('Error adding reviews:', reviewError);
    } else {
      console.log('Added reviews');
    }
  }
  
  // Add ticket types for events and series
  console.log('\nAdding ticket types...');
  
  if (allSeries && insertedEvents) {
    // Ticket types for individual events
    const eventTicketTypes = [
      {
        event_id: insertedEvents.find(e => e.title === 'Summer Rock Festival')?.id,
        name: 'General Admission',
        description: 'Access to all festival areas',
        price: 50,
        early_bird_price: 40,
        early_bird_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        max_quantity: 800,
        available_quantity: 800,
        benefits: ['Access to all stages', 'Free water stations'],
        is_active: true
      },
      {
        event_id: insertedEvents.find(e => e.title === 'Summer Rock Festival')?.id,
        name: 'VIP Pass',
        description: 'VIP experience with premium benefits',
        price: 150,
        early_bird_price: 120,
        max_quantity: 200,
        available_quantity: 200,
        benefits: ['VIP viewing area', 'Meet & greet', 'Free parking', 'VIP bar access'],
        is_active: true
      },
      {
        event_id: insertedEvents.find(e => e.title === 'Jazz Night with Sarah J')?.id,
        name: 'Standard Ticket',
        description: 'Reserved seating',
        price: 35,
        max_quantity: 150,
        available_quantity: 150,
        is_active: true
      }
    ];
    
    // Ticket types for series
    const seriesTicketTypes = [
      {
        series_id: allSeries.find(s => s.name === 'Clearwater Jazz Festival')?.id,
        name: 'Festival Pass',
        description: 'Access to all Jazz Festival events',
        price: 200,
        early_bird_price: 150,
        max_quantity: 500,
        available_quantity: 500,
        benefits: ['All festival events', 'Priority seating', 'Festival merchandise'],
        is_active: true
      },
      {
        series_id: allSeries.find(s => s.name === 'Clearwater Jazz Festival')?.id,
        name: 'Weekend Pass',
        description: 'Friday and Saturday events only',
        price: 120,
        max_quantity: 300,
        available_quantity: 300,
        benefits: ['Weekend events access', 'Festival wristband'],
        is_active: true
      },
      {
        series_id: allSeries.find(s => s.name === 'Tampa Bay Tech Conference')?.id,
        name: 'Full Conference Pass',
        description: 'All conference sessions and workshops',
        price: 299,
        early_bird_price: 199,
        max_quantity: 1000,
        available_quantity: 1000,
        benefits: ['All sessions', 'Lunch included', 'Networking events', 'Conference materials'],
        is_active: true
      },
      {
        series_id: allSeries.find(s => s.name === 'Summer Concert Series')?.id,
        name: 'Season Pass',
        description: 'Access to all summer concerts',
        price: 250,
        max_quantity: 200,
        available_quantity: 200,
        benefits: ['All concert access', 'Reserved seating section', '10% merch discount'],
        is_active: true
      }
    ];
    
    const { error: ticketError } = await supabase
      .from('ticket_types')
      .upsert([...eventTicketTypes, ...seriesTicketTypes]);
      
    if (ticketError) {
      console.error('Error adding ticket types:', ticketError);
    } else {
      console.log('Added ticket types for events and series');
    }
  }
  
  console.log('\n✅ Test data addition complete!');
}

addTestData().catch(console.error);
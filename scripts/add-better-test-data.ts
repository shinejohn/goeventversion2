import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addBetterTestData() {
  console.log('=== Adding Better Test Data ===\n');

  // 1. Update Events with better data
  const eventUpdates = [
    {
      title: "Summer Music Festival 2025",
      description: "Join us for the biggest music festival of the summer featuring top artists from around the world.",
      image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop",
      price_min: 75,
      price_max: 250,
      category: "Music",
      tags: ["festival", "music", "outdoor", "summer"],
      capacity: 5000,
      status: "published"
    },
    {
      title: "Comedy Night at The Laugh Track",
      description: "An evening of stand-up comedy featuring the best local and touring comedians.",
      image_url: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&h=600&fit=crop",
      price_min: 25,
      price_max: 45,
      category: "Comedy",
      tags: ["comedy", "standup", "nightlife"],
      capacity: 200,
      status: "published"
    },
    {
      title: "Food & Wine Festival",
      description: "Taste the best local cuisine paired with exceptional wines from nearby vineyards.",
      image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
      price_min: 50,
      price_max: 150,
      category: "Food & Drink",
      tags: ["food", "wine", "tasting", "culinary"],
      capacity: 1000,
      status: "published"
    },
    {
      title: "Tech Conference 2025",
      description: "Learn about the latest in technology, AI, and innovation from industry leaders.",
      image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      price_min: 199,
      price_max: 599,
      category: "Conference",
      tags: ["tech", "conference", "networking", "innovation"],
      capacity: 800,
      status: "published"
    },
    {
      title: "Outdoor Movie Night: Classic Films",
      description: "Watch classic movies under the stars in the park. Bring your blankets!",
      image_url: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&h=600&fit=crop",
      price_min: 0,
      price_max: 0,
      category: "Film",
      tags: ["movie", "outdoor", "family", "free"],
      capacity: 500,
      status: "published"
    }
  ];

  // Update existing events
  const { data: existingEvents } = await supabase
    .from('events')
    .select('id')
    .limit(5);

  if (existingEvents && existingEvents.length > 0) {
    for (let i = 0; i < Math.min(eventUpdates.length, existingEvents.length); i++) {
      const { error } = await supabase
        .from('events')
        .update(eventUpdates[i])
        .eq('id', existingEvents[i].id);
      
      if (!error) {
        console.log(`✅ Updated event: ${eventUpdates[i].title}`);
      } else {
        console.log(`❌ Error updating event: ${error.message}`);
      }
    }
  }

  // 2. Update Venues with better data
  const venueUpdates = [
    {
      name: "The Grand Theater",
      description: "Historic theater venue with state-of-the-art sound and lighting",
      address: "123 Main Street, San Francisco, CA 94102",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      image_url: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop",
      capacity: 1200,
      venue_type: "Theater",
      amenities: ["parking", "wheelchair accessible", "bar", "catering"],
      is_active: true,
      is_verified: true,
      rating: 4.8,
      review_count: 245
    },
    {
      name: "Sunset Beach Pavilion",
      description: "Beautiful oceanfront venue perfect for weddings and special events",
      address: "789 Ocean Drive, Santa Monica, CA 90401",
      city: "Santa Monica",
      state: "CA",
      country: "USA",
      image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
      capacity: 500,
      venue_type: "Event Space",
      amenities: ["ocean view", "parking", "catering kitchen", "outdoor space"],
      is_active: true,
      is_verified: true,
      rating: 4.9,
      review_count: 189
    },
    {
      name: "Downtown Convention Center",
      description: "Modern convention center with multiple halls and meeting rooms",
      address: "456 Business Blvd, Los Angeles, CA 90017",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      image_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
      capacity: 5000,
      venue_type: "Convention Center",
      amenities: ["parking", "WiFi", "AV equipment", "multiple halls"],
      is_active: true,
      is_verified: true,
      rating: 4.5,
      review_count: 412
    }
  ];

  // Update existing venues
  const { data: existingVenues } = await supabase
    .from('venues')
    .select('id')
    .limit(3);

  if (existingVenues && existingVenues.length > 0) {
    for (let i = 0; i < Math.min(venueUpdates.length, existingVenues.length); i++) {
      const { error } = await supabase
        .from('venues')
        .update(venueUpdates[i])
        .eq('id', existingVenues[i].id);
      
      if (!error) {
        console.log(`✅ Updated venue: ${venueUpdates[i].name}`);
      } else {
        console.log(`❌ Error updating venue: ${error.message}`);
      }
    }
  }

  // 3. Update Performers with better data
  const performerUpdates = [
    {
      name: "The Midnight Blues Band",
      stage_name: "Midnight Blues",
      category: "Band",
      genres: ["blues", "rock", "soul"],
      bio: "Award-winning blues band bringing soulful music to venues across the country.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      location: "San Francisco, CA",
      rating: 4.7,
      total_reviews: 156,
      availableForBooking: true,
      priceRange: "$$",
      is_touring_now: true
    },
    {
      name: "Sarah Johnson",
      stage_name: "DJ Luna",
      category: "DJ",
      genres: ["electronic", "house", "techno"],
      bio: "Internationally acclaimed DJ known for electrifying sets and packed dance floors.",
      image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=600&fit=crop",
      location: "Los Angeles, CA",
      rating: 4.9,
      total_reviews: 289,
      availableForBooking: true,
      priceRange: "$$$",
      is_touring_now: true
    },
    {
      name: "Comedy Crew Improv",
      stage_name: "Comedy Crew",
      category: "Comedy",
      genres: ["improv", "sketch", "standup"],
      bio: "Professional improv troupe bringing laughter to corporate events and theaters.",
      image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop",
      location: "San Diego, CA",
      rating: 4.8,
      total_reviews: 203,
      availableForBooking: true,
      priceRange: "$$",
      is_touring_now: false
    }
  ];

  // Update existing performers
  const { data: existingPerformers } = await supabase
    .from('performers')
    .select('id')
    .limit(3);

  if (existingPerformers && existingPerformers.length > 0) {
    for (let i = 0; i < Math.min(performerUpdates.length, existingPerformers.length); i++) {
      const { error } = await supabase
        .from('performers')
        .update(performerUpdates[i])
        .eq('id', existingPerformers[i].id);
      
      if (!error) {
        console.log(`✅ Updated performer: ${performerUpdates[i].name}`);
      } else {
        console.log(`❌ Error updating performer: ${error.message}`);
      }
    }
  }

  console.log('\n=== Data Update Complete ===');
  console.log('Homepage should now display better content with images!');
}

addBetterTestData();
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch live venues from Supabase API
async function fetchLiveVenues() {
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .limit(50);

    if (error) {
      console.error('Error fetching venues:', error);
      return fallbackMockVenues;
    }

    return venues || fallbackMockVenues;
  } catch (err) {
    console.error('Failed to fetch venues:', err);
    return fallbackMockVenues;
  }
}

// Fallback static data
const fallbackMockVenues = [{
  id: 'venue-1',
  name: 'The Grand Hall (LIVE DATA TEST)',
  description: 'A spectacular venue perfect for large events and performances',
  capacity: 500,
  pricePerHour: 300,
  location: {
    address: '123 Main Street, Clearwater, FL 33755',
    coordinates: {
      lat: 27.965853,
      lng: -82.800102
    }
  },
  rating: 4.8,
  reviewCount: 156,
  verified: true,
  responseTimeHours: 4,
  images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  amenities: ['Professional sound system', 'Stage lighting', 'Green room'],
  venueType: 'Performance Hall'
}];

// Export live data - this will be called by Magic Patterns components
export const mockVenues = await fetchLiveVenues();
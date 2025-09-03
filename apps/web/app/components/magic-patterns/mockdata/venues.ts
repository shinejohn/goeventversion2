// Mock venues data - static fallback
export const mockVenues = [{
  id: 'venue-1',
  name: 'The Grand Hall (LIVE DATA TEST)',
  description: 'A spectacular venue perfect for large events and performances',
  capacity: 500,
  pricePerHour: 300,
  address: '123 Main Street, Clearwater, FL 33755',
  images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  amenities: ['Professional sound system', 'Stage lighting', 'Green room'],
  average_rating: 4.8,
  total_reviews: 156,
  slug: 'the-grand-hall',
  community_id: 'clearwater-fl',
  account_id: 'account-1',
  location: {
    address: '123 Main Street, Clearwater, FL 33755',
    neighborhood: 'Downtown Clearwater',
    coordinates: {
      lat: 27.965853,
      lng: -82.800102
    }
  },
  rating: 4.8,
  reviewCount: 156,
  verified: true,
  responseTimeHours: 4,
  venueType: 'Performance Hall',
  distance: 2.5,
  listedDate: '2023-10-01',
  lastBookedDaysAgo: 5,
  unavailableDates: ['2024-01-15', '2024-01-22']
}, {
  id: 'venue-2',
  name: 'Sunset Rooftop',
  description: 'Beautiful rooftop venue with panoramic city views',
  capacity: 200,
  pricePerHour: 450,
  address: '456 Ocean Ave, Clearwater, FL 33755',
  images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  amenities: ['Outdoor seating', 'City views', 'Bar service'],
  average_rating: 4.6,
  total_reviews: 89,
  slug: 'sunset-rooftop',
  community_id: 'clearwater-fl',
  account_id: 'account-2',
  location: {
    address: '456 Ocean Ave, Clearwater, FL 33755',
    neighborhood: 'Beach District',
    coordinates: {
      lat: 27.975853,
      lng: -82.810102
    }
  },
  rating: 4.6,
  reviewCount: 89,
  verified: true,
  responseTimeHours: 2,
  venueType: 'Rooftop Bar',
  distance: 1.2,
  listedDate: '2023-11-15',
  lastBookedDaysAgo: 3,
  unavailableDates: ['2024-01-20']
}, {
  id: 'venue-3',
  name: 'Historic Theater',
  description: 'Classic theater with vintage charm and modern amenities',
  capacity: 300,
  pricePerHour: 650,
  address: '789 Arts Blvd, Clearwater, FL 33755',
  images: ['https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  amenities: ['Historic architecture', 'Stage', 'Dressing rooms'],
  average_rating: 4.9,
  total_reviews: 234,
  slug: 'historic-theater',
  community_id: 'clearwater-fl',
  account_id: 'account-3',
  location: {
    address: '789 Arts Blvd, Clearwater, FL 33755',
    neighborhood: 'Arts District',
    coordinates: {
      lat: 27.955853,
      lng: -82.790102
    }
  },
  rating: 4.9,
  reviewCount: 234,
  verified: true,
  responseTimeHours: 1,
  venueType: 'Theater',
  distance: 3.8,
  listedDate: '2023-08-01',
  lastBookedDaysAgo: 1,
  unavailableDates: []
}];
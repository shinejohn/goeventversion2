// Mock venues data - static fallback
export const mockVenues = [{
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
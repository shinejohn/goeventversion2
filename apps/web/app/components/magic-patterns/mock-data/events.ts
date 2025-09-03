// Mock events data for Magic Patterns integration
// This replaces the JSON import to be SSR-compatible with React Router 7

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  venue: {
    name: string;
    address: string;
  };
  category: string;
  imageUrl?: string;
  communityId: string;
}

export const mockEvents: MockEvent[] = [
  {
    id: "event-1",
    title: "Summer Music Festival",
    description: "A celebration of local artists with live performances throughout the day.",
    startTime: new Date("2024-07-15T14:00:00"),
    endTime: new Date("2024-07-15T23:00:00"),
    venue: {
      name: "Central Park Amphitheater",
      address: "123 Park Ave, Downtown"
    },
    category: "music",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    communityId: "community-1"
  },
  {
    id: "event-2", 
    title: "Food Truck Rally",
    description: "Taste the best food trucks in the city in one convenient location.",
    startTime: new Date("2024-07-20T11:00:00"),
    endTime: new Date("2024-07-20T21:00:00"),
    venue: {
      name: "City Square",
      address: "456 Main St, Downtown"
    },
    category: "food",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
    communityId: "community-1"
  },
  {
    id: "event-3",
    title: "Art Gallery Opening", 
    description: "Discover local artists and their latest works in this exclusive gallery opening.",
    startTime: new Date("2024-07-25T18:00:00"),
    endTime: new Date("2024-07-25T22:00:00"),
    venue: {
      name: "Modern Arts Gallery",
      address: "789 Art District Blvd"
    },
    category: "art",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
    communityId: "community-1"
  },
  {
    id: "event-4",
    title: "Tech Startup Meetup",
    description: "Network with fellow entrepreneurs and learn about the latest in tech innovation.",
    startTime: new Date("2024-08-01T17:30:00"),
    endTime: new Date("2024-08-01T21:30:00"),
    venue: {
      name: "Innovation Hub",
      address: "321 Tech Way, Business District"
    },
    category: "business",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
    communityId: "community-2"
  },
  {
    id: "event-5",
    title: "Farmers Market Saturday",
    description: "Fresh local produce, artisanal goods, and community gathering every Saturday.",
    startTime: new Date("2024-08-03T08:00:00"),
    endTime: new Date("2024-08-03T14:00:00"),
    venue: {
      name: "Town Square",
      address: "100 Community Center Dr"
    },
    category: "community",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9",
    communityId: "community-1"
  }
];

export default mockEvents;
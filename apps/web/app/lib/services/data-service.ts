import { type SupabaseClient } from '@supabase/supabase-js';
import mockEvents from '~/components/magic-patterns/mock-data/events.json';

interface DataService {
  getEvents(communityId: string, options?: EventOptions): Promise<Event[]>;
  getEvent(eventId: string): Promise<Event>;
  createEvent(data: CreateEventInput): Promise<Event>;
  updateEvent(id: string, data: UpdateEventInput): Promise<Event>;
}

// Development: Use mock data
class MockDataService implements DataService {
  async getEvents(communityId: string) {
    // Return Magic Patterns mock data
    return mockEvents.filter(e => e.communityId === communityId);
  }
  
  async getEvent(eventId: string) {
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    return event;
  }
  
  async createEvent(data: CreateEventInput) {
    // Simulate creation
    return { ...data, id: crypto.randomUUID() } as Event;
  }
  
  async updateEvent(id: string, data: UpdateEventInput) {
    const event = mockEvents.find(e => e.id === id);
    if (!event) throw new Error('Event not found');
    return { ...event, ...data };
  }
}

// Production: Use Supabase
class SupabaseDataService implements DataService {
  constructor(private client: SupabaseClient) {}
  
  async getEvents(communityId: string, options?: EventOptions) {
    const query = this.client
      .from('events')
      .select(`
        *,
        venue:venues(name, address),
        organizer:user_profiles(display_name)
      `)
      .eq('community_id', communityId)
      .eq('status', 'published');
      
    if (options?.startDate) {
      query.gte('start_datetime', options.startDate.toISOString());
    }
    if (options?.endDate) {
      query.lte('start_datetime', options.endDate.toISOString());
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return transformSupabaseEvents(data);
  }
  
  async getEvent(eventId: string) {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
      
    if (error) throw error;
    return transformSupabaseEvent(data);
  }
  
  async createEvent(data: CreateEventInput) {
    const { data: event, error } = await this.client
      .from('events')
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    return transformSupabaseEvent(event);
  }
  
  async updateEvent(id: string, data: UpdateEventInput) {
    const { data: event, error } = await this.client
      .from('events')
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return transformSupabaseEvent(event);
  }
}

// Factory function with environment detection
export function createDataService(client?: SupabaseClient): DataService {
  // Use mock data in development or when no client provided
  if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_DATA) {
    console.log('🎭 Using Mock Data Service');
    return new MockDataService();
  }
  
  if (!client) {
    throw new Error('Supabase client required for production data service');
  }
  
  console.log('🚀 Using Supabase Data Service');
  return new SupabaseDataService(client);
}

// Transform functions ensure data shape consistency
function transformSupabaseEvent(dbEvent: any): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    startTime: new Date(dbEvent.start_datetime),
    endTime: new Date(dbEvent.end_datetime),
    venue: {
      name: dbEvent.venue?.name || dbEvent.location_name,
      address: dbEvent.venue?.address || dbEvent.location_address,
    },
    category: dbEvent.category,
    imageUrl: dbEvent.featured_image_url,
    // ... map all fields to match Magic Patterns component expectations
  };
}
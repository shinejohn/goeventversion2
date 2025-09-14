import type { Route } from './+types/create';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const client = getSupabaseServerClient(request);
    
    // Load venues for venue selection
    const { data: venues, error: venuesError } = await client
      .from('venues')
      .select('id, name, address')
      .order('name');
    
    if (venuesError) {
      console.error('Error loading venues:', venuesError);
      return { venues: [], error: 'Failed to load venues' };
    }
    
    return { venues: venues || [] };
  } catch (error) {
    console.error('Loader error:', error);
    return { venues: [], error: 'Failed to load page data' };
  }
};

export const action = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (!user || userError) {
    return { error: 'You must be logged in to create an event' };
  }

  // Get user's community (using their personal account ID as community_id for now)
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .eq('is_personal_account', true)
    .single();

  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    venue_id: formData.get('venue_id') as string || null,
    start_datetime: formData.get('start_datetime') as string,
    end_datetime: formData.get('end_datetime') as string || formData.get('start_datetime') as string,
    price_min: parseFloat(formData.get('price') as string) || 0,
    price_max: parseFloat(formData.get('price') as string) || 0,
    capacity: parseInt(formData.get('capacity') as string) || 100,
    status: 'published',
    visibility: 'public',
    image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200',
    organizer_id: user.id,
    community_id: account?.id || user.id, // Use account ID or fall back to user ID
    account_id: account?.id || user.id,
    slug: formData.get('title')?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  const { data, error } = await client
    .from('events')
    .insert(eventData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating event:', error);
    return { error: error.message };
  }
  
  return redirect(`/events/${data.id}`);
};

export default function CreateEventPage({ loaderData, actionData }: Route.ComponentProps) {
  const { venues, error: loaderError } = loaderData;
  const error = actionData?.error || loaderError;
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form method="post" className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter event title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe your event"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select category</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="theater">Theater</option>
              <option value="conference">Conference</option>
              <option value="festival">Festival</option>
              <option value="exhibition">Exhibition</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="venue_id" className="block text-sm font-medium text-gray-700 mb-1">
              Venue *
            </label>
            <select
              id="venue_id"
              name="venue_id"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} - {venue.address}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              id="start_datetime"
              name="start_datetime"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="end_datetime"
              name="end_datetime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="100"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
          <a
            href="/events"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-block text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
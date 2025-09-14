import type { Route } from './+types/create';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Check if user is authenticated
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (!user || userError) {
    return redirect('/auth/sign-in?redirectTo=/venues/create');
  }
  
  return { user };
};

export const action = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (!user || userError) {
    return { error: 'You must be logged in to create a venue' };
  }

  // Get user's account
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .eq('is_personal_account', true)
    .single();

  const lat = parseFloat(formData.get('lat') as string) || null;
  const lng = parseFloat(formData.get('lng') as string) || null;
  
  const venueData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    address: formData.get('address') as string,
    venueType: formData.get('venueType') as string,
    venue_type: formData.get('venueType') as string, // Also add snake_case version
    capacity: parseInt(formData.get('capacity') as string) || 100,
    max_capacity: parseInt(formData.get('capacity') as string) || 100,
    amenities: {
      items: formData.get('amenities')?.toString().split(',').map(a => a.trim()) || []
    },
    rating: 0,
    reviewCount: 0,
    price_range: parseInt(formData.get('priceLevel') as string) || 2,
    image_url: formData.get('image') as string || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200',
    account_id: account?.id || user.id,
    community_id: account?.id || user.id, // Using account ID as community_id for now
    slug: formData.get('name')?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
    location: lat && lng ? `POINT(${lng} ${lat})` : `POINT(0 0)`,
    pricePerHour: (parseInt(formData.get('priceLevel') as string) || 2) * 50 // Convert price level to hourly rate
  };
  
  const { data, error } = await client
    .from('venues')
    .insert(venueData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating venue:', error);
    return { error: error.message };
  }
  
  return redirect(`/venues/${data.id}`);
};

export default function CreateVenuePage({ actionData }: Route.ComponentProps) {
  const error = actionData?.error;
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Venue</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form method="post" className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Venue Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter venue name"
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
            placeholder="Describe the venue"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter full address"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="venueType" className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              id="venueType"
              name="venueType"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select type</option>
              <option value="theater">Theater</option>
              <option value="stadium">Stadium</option>
              <option value="arena">Arena</option>
              <option value="club">Club</option>
              <option value="outdoor">Outdoor</option>
              <option value="convention_center">Convention Center</option>
              <option value="restaurant">Restaurant</option>
              <option value="bar">Bar</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity *
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="100"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              id="lat"
              name="lat"
              step="0.000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="40.7128"
            />
          </div>
          
          <div>
            <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              id="lng"
              name="lng"
              step="0.000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="-74.0060"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="priceLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Price Level (1-4)
          </label>
          <select
            id="priceLevel"
            name="priceLevel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select price level</option>
            <option value="1">$ - Budget</option>
            <option value="2">$$ - Moderate</option>
            <option value="3">$$$ - Premium</option>
            <option value="4">$$$$ - Luxury</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
            Amenities (comma-separated)
          </label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Parking, WiFi, Accessible, Bar"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/venue-image.jpg"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Create Venue
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
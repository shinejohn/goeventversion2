import type { Route } from './+types/create';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Check if user is authenticated
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (!user || userError) {
    return redirect('/auth/sign-in?redirectTo=/performers/create');
  }
  
  return { user };
};

export const action = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (!user || userError) {
    return { error: 'You must be logged in to create a performer profile' };
  }

  // Get user's account
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .eq('is_personal_account', true)
    .single();

  const performerData = {
    name: formData.get('name') as string,
    bio: formData.get('bio') as string,
    genres: [formData.get('genre') as string], // Database expects array
    location: formData.get('location') as string,
    home_city: formData.get('location') as string, // Also populate home_city
    rating: 0,
    reviews: 0,
    total_reviews: 0,
    price: formData.get('price') as string,
    priceRange: formData.get('price') as string, // Also add priceRange field
    image: formData.get('image') as string || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    next_performance: formData.get('nextPerformance') as string || null,
    account_id: account?.id || user.id,
    slug: formData.get('name')?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '',
    availableForBooking: true,
    verified: false
  };
  
  const { data, error } = await client
    .from('performers')
    .insert(performerData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating performer:', error);
    return { error: error.message };
  }
  
  return redirect(`/performers/${data.id}`);
};

export default function CreatePerformerPage({ actionData }: Route.ComponentProps) {
  const error = actionData?.error;
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Performer</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form method="post" className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Performer Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter performer name"
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biography
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tell us about the performer"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre *
            </label>
            <select
              id="genre"
              name="genre"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select genre</option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="jazz">Jazz</option>
              <option value="classical">Classical</option>
              <option value="electronic">Electronic</option>
              <option value="hip-hop">Hip Hop</option>
              <option value="country">Country</option>
              <option value="folk">Folk</option>
              <option value="comedy">Comedy</option>
              <option value="theater">Theater</option>
              <option value="dance">Dance</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="City, State"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <input
            type="text"
            id="price"
            name="price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., $50-$200"
          />
        </div>
        
        <div>
          <label htmlFor="nextPerformance" className="block text-sm font-medium text-gray-700 mb-1">
            Next Performance Date
          </label>
          <input
            type="datetime-local"
            id="nextPerformance"
            name="nextPerformance"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
            placeholder="https://example.com/performer-image.jpg"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
          >
            Create Performer
          </button>
          <a
            href="/performers"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 inline-block text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
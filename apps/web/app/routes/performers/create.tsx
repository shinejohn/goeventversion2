import type { Route } from './+types/create';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Textarea } from '@kit/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@kit/ui/select';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          <Label htmlFor="name">Performer Name *</Label>
          <Input 
            id="name"
            name="name" 
            required 
            placeholder="Enter performer name"
          />
        </div>
        
        <div>
          <Label htmlFor="bio">Biography</Label>
          <Textarea 
            id="bio"
            name="bio" 
            rows={4}
            placeholder="Tell us about the performer"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="genre">Genre *</Label>
            <Select name="genre" required>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="hip-hop">Hip Hop</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="folk">Folk</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="theater">Theater</SelectItem>
                <SelectItem value="dance">Dance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location"
              name="location" 
              placeholder="City, State"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="price">Price Range</Label>
          <Input 
            id="price"
            name="price" 
            placeholder="e.g., $50-$200"
          />
        </div>
        
        <div>
          <Label htmlFor="nextPerformance">Next Performance Date</Label>
          <Input 
            id="nextPerformance"
            name="nextPerformance" 
            type="datetime-local"
          />
        </div>
        
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input 
            id="image"
            name="image" 
            type="url" 
            placeholder="https://example.com/performer-image.jpg"
          />
        </div>
        
        <div className="flex gap-4">
          <Button 
            type="submit"
            disabled={isSubmitting}
            onClick={() => setIsSubmitting(true)}
          >
            {isSubmitting ? 'Creating...' : 'Create Performer'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
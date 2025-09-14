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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          <Label htmlFor="name">Venue Name *</Label>
          <Input 
            id="name"
            name="name" 
            required 
            placeholder="Enter venue name"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            name="description" 
            rows={4}
            placeholder="Describe the venue"
          />
        </div>
        
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input 
            id="address"
            name="address" 
            required 
            placeholder="Enter full address"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="venueType">Type *</Label>
            <Select name="venueType" required>
              <SelectTrigger id="venueType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theater">Theater</SelectItem>
                <SelectItem value="stadium">Stadium</SelectItem>
                <SelectItem value="arena">Arena</SelectItem>
                <SelectItem value="club">Club</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="convention_center">Convention Center</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="capacity">Capacity *</Label>
            <Input 
              id="capacity"
              name="capacity" 
              type="number" 
              min="1" 
              required
              placeholder="100"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input 
              id="lat"
              name="lat" 
              type="number" 
              step="0.000001"
              placeholder="40.7128"
            />
          </div>
          
          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input 
              id="lng"
              name="lng" 
              type="number" 
              step="0.000001"
              placeholder="-74.0060"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="priceLevel">Price Level (1-4)</Label>
          <Select name="priceLevel">
            <SelectTrigger id="priceLevel">
              <SelectValue placeholder="Select price level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">$ - Budget</SelectItem>
              <SelectItem value="2">$$ - Moderate</SelectItem>
              <SelectItem value="3">$$$ - Premium</SelectItem>
              <SelectItem value="4">$$$$ - Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input 
            id="amenities"
            name="amenities" 
            placeholder="Parking, WiFi, Accessible, Bar"
          />
        </div>
        
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input 
            id="image"
            name="image" 
            type="url" 
            placeholder="https://example.com/venue-image.jpg"
          />
        </div>
        
        <div className="flex gap-4">
          <Button 
            type="submit"
            disabled={isSubmitting}
            onClick={() => setIsSubmitting(true)}
          >
            {isSubmitting ? 'Creating...' : 'Create Venue'}
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
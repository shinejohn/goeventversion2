import type { Route } from '~/types/app/routes/events/create/+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { useState } from 'react';
import { toast } from '@kit/ui/sonner';
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
  
  // Load venues for venue selection
  const { data: venues } = await client
    .from('venues')
    .select('id, name, address')
    .order('name');
  
  return { venues: venues || [] };
};

export const action = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    venue_id: formData.get('venue_id') as string,
    start_datetime: formData.get('start_datetime') as string,
    end_datetime: formData.get('end_datetime') as string,
    price: parseFloat(formData.get('price') as string) || 0,
    capacity: parseInt(formData.get('capacity') as string) || 100,
    status: 'published',
    image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200'
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { venues } = loaderData;
  const error = actionData?.error;
  
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
          <Label htmlFor="title">Event Title *</Label>
          <Input 
            id="title"
            name="title" 
            required 
            placeholder="Enter event title"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            name="description" 
            rows={4}
            placeholder="Describe your event"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select name="category" required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concert">Concert</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="theater">Theater</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="exhibition">Exhibition</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="venue_id">Venue *</Label>
            <Select name="venue_id" required>
              <SelectTrigger id="venue_id">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name} - {venue.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_datetime">Start Date & Time *</Label>
            <Input 
              id="start_datetime"
              name="start_datetime" 
              type="datetime-local" 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="end_datetime">End Date & Time</Label>
            <Input 
              id="end_datetime"
              name="end_datetime" 
              type="datetime-local" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input 
              id="price"
              name="price" 
              type="number" 
              step="0.01" 
              min="0" 
              placeholder="0.00"
            />
          </div>
          
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input 
              id="capacity"
              name="capacity" 
              type="number" 
              min="1" 
              placeholder="100"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input 
            id="image_url"
            name="image_url" 
            type="url" 
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="flex gap-4">
          <Button 
            type="submit"
            disabled={isSubmitting}
            onClick={() => setIsSubmitting(true)}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
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
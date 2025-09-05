import { json } from 'react-router';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

const checkInSchema = z.object({
  venue_id: z.string().uuid(),
  venue_name: z.string(),
  event_id: z.string().uuid().optional(),
  note: z.string().optional(),
  mood: z.string().optional(),
  privacy: z.enum(['public', 'friends', 'private']).default('friends'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional()
  }).optional(),
  event_details: z.object({
    name: z.string(),
    date: z.string(),
    time: z.string(),
    imageUrl: z.string().optional(),
    ticketId: z.string().optional(),
    calendarEventId: z.string().optional()
  }).optional()
});

export async function action({ request }: { request: Request }) {
  const client = getSupabaseServerClient(request);
  
  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's account
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .single();

  try {
    const data = checkInSchema.parse(await request.json());

    // End any active check-ins at other venues
    await client
      .from('checkins')
      .update({ 
        is_active: false,
        check_out_time: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Create new check-in
    const checkInData = {
      user_id: user.id,
      account_id: account?.id || user.id,
      venue_id: data.venue_id,
      venue_name: data.venue_name,
      event_id: data.event_id,
      note: data.note,
      mood: data.mood,
      privacy: data.privacy,
      event_details: data.event_details,
      is_active: true
    };

    // Add location if provided
    if (data.location) {
      checkInData.location = `(${data.location.longitude},${data.location.latitude})`;
      checkInData.location_accuracy = data.location.accuracy;
    }

    const { data: checkIn, error } = await client
      .from('checkins')
      .insert(checkInData)
      .select()
      .single();

    if (error) {
      console.error('Check-in creation error:', error);
      return json({ error: 'Failed to create check-in' }, { status: 500 });
    }

    return json({ success: true, checkIn });

  } catch (error) {
    console.error('Validation error:', error);
    return json({ error: 'Invalid check-in data' }, { status: 400 });
  }
}

// Get recent check-ins
export async function loader({ request }: { request: Request }) {
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const privacy = url.searchParams.get('privacy') || 'public';

  const { data: checkIns, error } = await client
    .from('checkins')
    .select(`
      *,
      user:accounts!checkins_user_id_fkey(name, picture_url),
      venue:venues(name, address, city, state),
      event:events(title, image_url)
    `)
    .eq('privacy', privacy)
    .order('check_in_time', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Check-ins fetch error:', error);
    return json({ error: 'Failed to fetch check-ins' }, { status: 500 });
  }

  return json({ checkIns });
}
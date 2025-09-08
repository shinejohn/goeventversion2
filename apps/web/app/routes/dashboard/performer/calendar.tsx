import React from 'react';
import { json } from 'react-router';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/performer/calendar';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { PerformerCalendar } from '~/components/magic-patterns/components/performers/PerformerCalendar';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ 
        events: [],
        availability: [],
        blockedDates: []
      });
    }

    // Check if user is a performer
    const { data: performerRole } = await client
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role_type', 'performer')
      .eq('is_active', true)
      .single();

    if (!performerRole) {
      return json({ 
        events: [],
        availability: [],
        blockedDates: [],
        needsRole: true
      });
    }

    // Get performer profile
    const { data: performer } = await client
      .from('performers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!performer) {
      return json({ 
        events: [],
        availability: [],
        blockedDates: [],
        needsProfile: true
      });
    }

    // Fetch performer's events for calendar
    const { data: events } = await client
      .from('events')
      .select(`
        id,
        title,
        start_datetime,
        end_datetime,
        status,
        venue:venues!events_venue_id_fkey(
          id,
          name,
          city,
          state
        )
      `)
      .eq('performer_id', performer.id)
      .gte('start_datetime', new Date().toISOString())
      .order('start_datetime', { ascending: true });

    // Get performer availability
    const { data: availability } = await client
      .from('performer_availability')
      .select('date, is_available')
      .eq('performer_id', performer.id)
      .gte('date', new Date().toISOString());

    // Transform events for calendar
    const calendarEvents = (events || []).map(e => ({
      id: e.id,
      title: e.title,
      start: e.start_datetime,
      end: e.end_datetime,
      venue: e.venue?.name || 'TBD',
      location: e.venue ? `${e.venue.city}, ${e.venue.state}` : '',
      status: e.status,
      type: 'booking' as const
    }));

    // Transform availability
    const blockedDates = (availability || [])
      .filter(a => !a.is_available)
      .map(a => a.date);

    return json({
      events: calendarEvents,
      availability: availability || [],
      blockedDates
    });

  } catch (error) {
    logger.error({ error }, 'Error loading performer calendar');
    return json({ 
      events: [],
      availability: [],
      blockedDates: []
    });
  }
};

export async function action({ request }: Route.ActionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get performer profile
    const { data: performer } = await client
      .from('performers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!performer) {
      return json({ success: false, error: 'Performer profile not found' }, { status: 404 });
    }

    if (action === 'update-availability') {
      const date = formData.get('date') as string;
      const available = formData.get('available') === 'true';
      
      const { error } = await client
        .from('performer_availability')
        .upsert({
          performer_id: performer.id,
          date,
          is_available: available,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'performer_id,date'
        });

      if (error) {
        logger.error({ error }, 'Error updating availability');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'block-dates') {
      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string;
      
      // Create array of dates to block
      const dates: string[] = [];
      const current = new Date(startDate);
      const end = new Date(endDate);
      
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }

      // Block all dates in range
      const blockedDates = dates.map(date => ({
        performer_id: performer.id,
        date,
        is_available: false,
        updated_at: new Date().toISOString()
      }));

      const { error } = await client
        .from('performer_availability')
        .upsert(blockedDates, {
          onConflict: 'performer_id,date'
        });

      if (error) {
        logger.error({ error }, 'Error blocking dates');
        return json({ success: false, error: error.message });
      }

      return json({ success: true, blockedCount: dates.length });
    }

    if (action === 'unblock-dates') {
      const startDate = formData.get('startDate') as string;
      const endDate = formData.get('endDate') as string;
      
      const { error } = await client
        .from('performer_availability')
        .delete()
        .eq('performer_id', performer.id)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        logger.error({ error }, 'Error unblocking dates');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing calendar action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * Performer booking calendar and availability
 */
export default function PerformerCalendarPage() {
  const data = useLoaderData<typeof loader>();
  return <PerformerCalendar {...data} />;
}
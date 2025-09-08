import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { NotificationsPage } from '~/components/magic-patterns/pages/social/NotificationsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';

export async function loader({ request }: LoaderFunctionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ notifications: [] });
    }

    // Fetch notifications for the user
    const { data: notifications, error } = await client
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      logger.error({ error }, 'Error fetching notifications');
      return json({ notifications: [] });
    }

    return json({ notifications: notifications || [] });

  } catch (error) {
    logger.error({ error }, 'Error loading notifications');
    return json({ notifications: [] });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'mark-read') {
      const notificationId = formData.get('notificationId') as string;
      
      const { error } = await client
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        logger.error({ error }, 'Error marking notification as read');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'mark-all-read') {
      const { error } = await client
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .is('read_at', null);

      if (error) {
        logger.error({ error }, 'Error marking all notifications as read');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'delete') {
      const notificationId = formData.get('notificationId') as string;
      
      const { error } = await client
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        logger.error({ error }, 'Error deleting notification');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing notification action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export default function NotificationsRoute() {
  const { notifications } = useLoaderData<typeof loader>();
  
  // Transform notifications to match component expectations
  const transformedNotifications = notifications.map(notif => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    time: notif.created_at,
    read: notif.is_read,
    link: notif.link || undefined,
    data: notif.data || {}
  }));

  return <NotificationsPage notifications={transformedNotifications} />;
}
import React from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/social/friends';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { FriendsPage } from '~/components/magic-patterns/pages/social/FriendsPage';
import { getLogger } from '@kit/shared/logger';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'accepted' | 'pending';
  created_at: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return { friends: [], pendingRequests: [] };
    }

    // Get all friendships where user is either the requester or receiver
    const { data: friendships, error } = await client
      .from('friendships')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        user:auth.users!friendships_user_id_fkey(id, email, raw_user_meta_data),
        friend:auth.users!friendships_friend_id_fkey(id, email, raw_user_meta_data)
      `)
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (error) {
      logger.error({ error }, 'Error fetching friendships');
      return { friends: [], pendingRequests: [] };
    }

    // Process friendships into friends and pending requests
    const friends: Friend[] = [];
    const pendingRequests: Friend[] = [];

    friendships?.forEach(friendship => {
      const isRequester = friendship.user_id === user.id;
      const otherUser = isRequester ? friendship.friend : friendship.user;
      
      if (otherUser) {
        const friend: Friend = {
          id: otherUser.id,
          name: otherUser.raw_user_meta_data?.name || otherUser.email.split('@')[0],
          email: otherUser.email,
          avatar: otherUser.raw_user_meta_data?.avatar_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.email}`,
          status: friendship.status,
          created_at: friendship.created_at
        };

        if (friendship.status === 'accepted') {
          friends.push(friend);
        } else if (friendship.status === 'pending' && !isRequester) {
          // Only show pending requests where current user is the recipient
          pendingRequests.push(friend);
        }
      }
    });

    return { friends, pendingRequests };

  } catch (error) {
    logger.error({ error }, 'Error loading friends');
    return json({ friends: [], pendingRequests: [] });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }

    if (action === 'send-request') {
      const friendId = formData.get('friendId') as string;
      
      // Check if friendship already exists
      const { data: existing } = await client
        .from('friendships')
        .select('id')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
        .single();

      if (existing) {
        throw new Response('Friend request already exists', { status: 400 });
      }

      // Create friend request
      const { error } = await client
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) {
        logger.error({ error }, 'Error sending friend request');
        throw new Response(error.message, { status: 500 });
      }

      // Create notification
      await client
        .from('notifications')
        .insert({
          user_id: friendId,
          type: 'friend_request',
          title: 'New Friend Request',
          message: 'You have a new friend request',
          link: '/social/friends'
        });

      return { success: true };
    }

    if (action === 'accept-request') {
      const friendId = formData.get('friendId') as string;
      
      const { error } = await client
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('user_id', friendId)
        .eq('friend_id', user.id);

      if (error) {
        logger.error({ error }, 'Error accepting friend request');
        throw new Response(error.message, { status: 500 });
      }

      // Create notification
      await client
        .from('notifications')
        .insert({
          user_id: friendId,
          type: 'friend_request_accepted',
          title: 'Friend Request Accepted',
          message: 'Your friend request has been accepted',
          link: '/social/friends'
        });

      return { success: true };
    }

    if (action === 'decline-request' || action === 'remove-friend') {
      const friendId = formData.get('friendId') as string;
      
      const { error } = await client
        .from('friendships')
        .delete()
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

      if (error) {
        logger.error({ error }, 'Error removing friend');
        throw new Response(error.message, { status: 500 });
      }

      return { success: true };
    }

    throw new Response('Invalid action', { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing friend action');
    throw new Response('Server error', { status: 500 });
  }
}

export default function FriendsRoute() {
  const { friends, pendingRequests } = useLoaderData<typeof loader>();
  return <FriendsPage friends={friends} pendingRequests={pendingRequests} />;
}
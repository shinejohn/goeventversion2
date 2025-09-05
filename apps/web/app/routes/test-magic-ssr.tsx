import React from 'react';
import type { Route } from './+types/test-magic-ssr';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { HomePage } from '~/components/magic-patterns/pages/HomePage';

// SSR-safe loader following Makerkit pattern
export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Future: Fetch real data from Supabase
  // const { data: events } = await client.from('events').select('*');
  
  return {
    title: 'Go Event City - Find Amazing Events',
    description: 'Discover and book tickets for concerts, sports, theater, and more in your city',
    // Mock data for now
    featuredEvents: [
      { id: 1, name: 'Sample Event', date: '2024-12-15' }
    ]
  };
};

// Meta function for SEO
export const meta = ({ data }: Route.MetaArgs) => {
  return [
    { title: data?.title || 'Go Event City' },
    { name: 'description', content: data?.description || 'Find events near you' }
  ];
};

// Component using props.loaderData pattern (SSR-safe)
export default function TestMagicSSR(props: Route.ComponentProps) {
  // SSR-safe: Using props.loaderData instead of useLoaderData() hook
  const { featuredEvents } = props.loaderData;
  
  // Pass data to Magic Patterns component if needed
  // For now, HomePage uses its own mock data
  return <HomePage />;
}
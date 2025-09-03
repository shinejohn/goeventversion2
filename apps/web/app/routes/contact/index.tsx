import { ContactUsPage } from '~/components/magic-patterns/pages/ContactUsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/contact/+types';
import { json, redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: 'ContactUs - GoEventCity',
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  
  // TODO: Implement contact form submission
  // Send email or save to database
  
  return json({ success: true, message: 'Thank you for contacting us!' });
};

export default function ContactUsRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <ContactUsPage />;
}

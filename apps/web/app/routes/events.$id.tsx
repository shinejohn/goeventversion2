import { EventDetailPage } from '~/components/magic-patterns/pages/EventDetailPage';
import type { Route } from '~/types/app/routes/events/$id/+types';

export const loader = async ({ params }: Route.LoaderArgs) => {
  return {
    eventId: params.id,
    title: `Event Details - GoEventCity`,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'View detailed information about this event',
    },
  ];
};

export default function EventDetailRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <EventDetailPage eventId={data.eventId} />;
}
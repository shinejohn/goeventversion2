import { HomePage } from '~/components/magic-patterns/pages/HomePage';
import type { Route } from '~/types/app/routes/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  return {
    title: 'GoEventCity - Discover Events, Venues & Performers',
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events, book venues, and connect with performers in your city',
    },
  ];
};

export default function HomeRoute(props: Route.ComponentProps) {
  return <HomePage />;
}
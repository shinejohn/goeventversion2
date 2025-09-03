import { PerformerProfilePage } from '~/components/magic-patterns/pages/performers/PerformerProfilePage';
import type { Route } from '~/types/app/routes/performers/$id/+types';

export const loader = async ({ params }: Route.LoaderArgs) => {
  return {
    performerId: params.id,
    title: `Performer Profile - GoEventCity`,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'View detailed information about this performer',
    },
  ];
};

export default function PerformerProfileRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <PerformerProfilePage performerId={data.performerId} />;
}
import React from 'react';
import { BookPerformerPage } from '~/components/magic-patterns/pages/book/BookPerformerPage';
import type { Route } from '~/types/app/routes/book/performer/+types/$id';

export const loader = async ({ params }: Route.LoaderArgs) => {
  // Future: Load specific performer data based on params.id
  return {
    performerId: params.id
  };
};

export default function BookSpecificPerformerRoute({ loaderData }: Route.ComponentProps) {
  // For now, use the BookPerformerPage which shows a list
  // In the future, this should show a booking form for the specific performer
  return <BookPerformerPage />;
}
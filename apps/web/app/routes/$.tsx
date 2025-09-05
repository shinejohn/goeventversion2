import React from 'react';
import type { Route } from '~/types/app/routes/+types/$';;

import { NotFoundPage } from '~/components/magic-patterns/pages/NotFoundPage';

export const meta = () => {
  return [
    {
      title: 'Page Not Found - GoEventCity',
    },
    {
      name: 'description',
      content: 'The page you are looking for could not be found.',
    },
  ];
};

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
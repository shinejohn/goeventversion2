import React from 'react';
import { useParams } from 'react-router';
import { VenueDetailPage } from '~/components/magic-patterns/pages/venues/VenueDetailPage';

export default function VenueDetailRoute() {
  const params = useParams();
  // TODO: Pass the venue ID to the component once it accepts props
  return <VenueDetailPage />;
}
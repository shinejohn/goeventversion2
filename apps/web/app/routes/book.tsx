import type { Route } from '~/types/app/routes/+types/book';;

import { BookItPage } from '~/components/magic-patterns/pages/BookItPage';
import { VenueBookingWidget } from '~/components/magic-patterns/components/venue-profile/VenueBookingWidget';

export default function BookRoute() {
  return <BookItPage />;
}
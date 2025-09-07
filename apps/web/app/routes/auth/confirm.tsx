import React from 'react';
import { redirect } from 'react-router';

import { createAuthCallbackService } from '@kit/supabase/auth';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';
import type { Route } from './+types/auth/confirm';
import { ConfirmationStep } from '~/components/magic-patterns/components/booking/ConfirmationStep';
import { BookingConfirmation } from '~/components/magic-patterns/components/booking-form/BookingConfirmation';
import { TicketPurchaseConfirmation } from '~/components/magic-patterns/components/tickets/TicketPurchaseConfirmation';
import { BookingConfirmationPopup } from '~/components/magic-patterns/components/venue-detail/BookingConfirmationPopup';
import { mockConfirmedBooking } from '~/components/magic-patterns/mockdata/bookings';
import { BookingConfirmationPage } from '~/components/magic-patterns/pages/bookings/BookingConfirmationPage';
import { CheckoutConfirmationPage } from '~/components/magic-patterns/pages/checkout/CheckoutConfirmationPage';

export async function loader({ request }: Route.LoaderArgs) {
  const service = createAuthCallbackService(getSupabaseServerClient(request));

  const url = await service.verifyTokenHash(request, {
    joinTeamPath: pathsConfig.app.joinTeam,
    redirectPath: pathsConfig.app.home,
  });

  return redirect(url.href, {
    headers: request.headers,
  });
}

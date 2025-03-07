import { getDatabaseWebhookHandlerService } from '@kit/database-webhooks';
import { getServerMonitoringService } from '@kit/monitoring/server';

import type { Route } from '~/types/app/routes/api/db/+types/webhook';

/**
 * @description POST handler for the webhook route that handles the webhook event
 */
export const action = async ({ request }: Route.ActionArgs) => {
  const service = getDatabaseWebhookHandlerService();

  try {
    // handle the webhook event
    await service.handleWebhook(request);

    // return a successful response
    return new Response(null, { status: 200 });
  } catch (error) {
    const service = await getServerMonitoringService();

    await service.ready();
    await service.captureException(error as Error);

    // return an error response
    return new Response(null, { status: 500 });
  }
};

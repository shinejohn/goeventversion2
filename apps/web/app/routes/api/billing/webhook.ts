import { getPlanTypesMap } from '@kit/billing';
import { getBillingEventHandlerService } from '@kit/billing-gateway';
import { getLogger } from '@kit/shared/logger';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import billingConfig from '~/config/billing.config';
import type { Route } from '~/types/app/routes/api/billing/+types/webhook';

const provider = billingConfig.provider;

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
export const action = async ({ request }: Route.ActionArgs) => {
  const logger = await getLogger();

  const ctx = {
    name: 'billing.webhook',
    provider,
  };

  logger.info(ctx, `Received billing webhook. Processing...`);

  const supabaseClientProvider = () => getSupabaseServerAdminClient();

  const service = await getBillingEventHandlerService(
    supabaseClientProvider,
    provider,
    getPlanTypesMap(billingConfig),
  );

  try {
    await service.handleWebhookEvent(request);

    logger.info(ctx, `Successfully processed billing webhook`);

    return new Response('OK', { status: 200 });
  } catch (error) {
    logger.error({ ...ctx, error }, `Failed to process billing webhook`);

    return new Response('Failed to process billing webhook', {
      status: 500,
    });
  }
};

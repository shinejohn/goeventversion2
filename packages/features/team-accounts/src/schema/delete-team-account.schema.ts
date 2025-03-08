import { z } from 'zod';

import { CsrfTokenSchema } from '@kit/csrf/schema';

export const DeleteTeamAccountSchema = z.object({
  payload: CsrfTokenSchema.extend({
    accountId: z.string().uuid(),
    otp: z.string().min(6),
  }),
  intent: z.literal('delete-team-account'),
});

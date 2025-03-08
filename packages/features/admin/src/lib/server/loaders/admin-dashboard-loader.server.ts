import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

import { createAdminDashboardService } from '../services/admin-dashboard.service';

/**
 * @name loadAdminDashboard
 * @description Load the admin dashboard data.
 */
export const loadAdminDashboard = (client: SupabaseClient<Database>) => {
  const service = createAdminDashboardService(client);

  return service.getDashboardData();
};

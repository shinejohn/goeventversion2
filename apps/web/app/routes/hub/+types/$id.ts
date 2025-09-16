import type { Route } from '@kit/supabase/database';

export type LoaderArgs = {
  request: Request;
  params: {
    id: string;
  };
};

export type ComponentProps = {
  loaderData: {
    hub: any;
    members: any[];
    activities: any[];
  };
};
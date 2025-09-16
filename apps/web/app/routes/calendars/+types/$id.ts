export type LoaderArgs = {
  request: Request;
  params: {
    id: string;
  };
};

export type ActionArgs = {
  request: Request;
  params: {
    id: string;
  };
};

export type ComponentProps = {
  loaderData: {
    calendar: any | null;
    events: any[];
    isSubscribed: boolean;
  };
  actionData?: {
    success?: boolean;
    error?: string;
    message?: string;
  };
};

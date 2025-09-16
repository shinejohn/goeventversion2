export type LoaderArgs = {
  request: Request;
};

export type ActionArgs = {
  request: Request;
};

export type ComponentProps = {
  loaderData: {
    cartItems: any[];
    user: any | null;
    account: any | null;
  };
  actionData?: {
    success?: boolean;
    error?: string;
    orderId?: string;
    message?: string;
  };
};

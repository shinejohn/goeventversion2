export type LoaderArgs = {
  request: Request;
};

export type ActionArgs = {
  request: Request;
};

export type ComponentProps = {
  actionData?: {
    success?: boolean;
    error?: string;
    product?: any;
  };
};

import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  MetaArgs,
} from 'react-router';

export interface LoaderArgs extends LoaderFunctionArgs {
  params: {
    venueId: string;
  };
}

export interface ActionArgs extends ActionFunctionArgs {
  params: {
    venueId: string;
  };
}

export interface MetaArgs extends MetaArgs {
  params: {
    venueId: string;
  };
}

export type Loader = LoaderFunction;
export type Action = ActionFunction;
export type Meta = MetaFunction;

export namespace Route {
  export type LoaderArgs = LoaderArgs;
  export type ActionArgs = ActionArgs;
  export type MetaArgs = MetaArgs;
}
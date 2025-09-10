import type {
  LoaderFunction,
  LoaderFunctionArgs,
} from 'react-router';

export interface LoaderArgs extends LoaderFunctionArgs {
  params: {};
}

export type Loader = LoaderFunction;

export namespace Route {
  export type LoaderArgs = LoaderArgs;
  export interface ComponentProps {
    loaderData: any;
  }
}
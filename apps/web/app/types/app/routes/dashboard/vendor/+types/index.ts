import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

export interface Route {
  LoaderArgs: LoaderFunctionArgs;
  ActionArgs: ActionFunctionArgs;
}
import React from 'react';
import type { Route } from './+types/account/billing-return';

import * as ReturnPage from '../account/billing-return';

export const meta = ReturnPage.meta;

export const loader = (args: Route.LoaderArgs) => {
  return ReturnPage.loader(args);
};

const Page = ReturnPage.default;

export default Page;

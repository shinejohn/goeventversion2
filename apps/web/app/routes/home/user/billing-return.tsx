import type { Route } from '~/types/app/routes/home/account/+types/billing-return';

import * as ReturnPage from '../account/billing-return';

export const meta = ReturnPage.meta;

export const loader = (args: Route.LoaderArgs) => {
  return ReturnPage.loader(args);
};

const Page = ReturnPage.default;

export default Page;

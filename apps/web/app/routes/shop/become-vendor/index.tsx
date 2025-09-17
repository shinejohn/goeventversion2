import type { Route } from './+types/route.ts';
import { BecomeVendorPage } from '~/components/magic-patterns/pages/shop/BecomeVendorPage';

export const meta = () => {
  return [
    {
      title: 'Become a Vendor | GoEventCity Shop',
    },
    {
      name: 'description',
      content: 'Join our marketplace and reach thousands of event organizers. Sell your event supplies and equipment on GoEventCity.',
    },
  ];
};

export default function BecomeVendorRoute() {
  return <BecomeVendorPage />;
}
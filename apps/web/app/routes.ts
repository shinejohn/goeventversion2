import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

const rootRoutes = [
  route('robots.txt', 'routes/robots/route.tsx'),
  route('sitemap.xml', 'routes/sitemap/route.tsx'),
  route('version', 'routes/version.ts'),
  route('healthcheck', 'routes/healthcheck.ts'),
  route('update-password', 'routes/update-password.tsx'),
  route('join', 'routes/join.tsx'),
];

const apiRoutes = [
  route('api/accounts', 'routes/api/accounts.ts'),
  route('api/billing/checkout', 'routes/api/billing/checkout.ts'),
  route('api/billing/webhook', 'routes/api/billing/webhook.ts'),
  route('api/db/webhook', 'routes/api/db/webhook.ts'),
  route('api/otp/send', 'routes/api/otp/send.ts'),
];

// Magic Patterns routes with layout wrapper
const magicPatternsLayout = layout('routes/magic-patterns/layout.tsx', [
  index('routes/index.tsx'), // HomePage
  route('about', 'routes/about/index.tsx'),
  route('advertise', 'routes/advertise/index.tsx'),
  route('advertise/packages', 'routes/advertise/packages/index.tsx'),
  route('advertise/email-campaigns', 'routes/advertise/email-campaigns/index.tsx'),
  route('advertise/event-promotion', 'routes/advertise/event-promotion/index.tsx'),
  route('advertise/featured-listings', 'routes/advertise/featured-listings/index.tsx'),
  route('advertise/homepage-showcase', 'routes/advertise/homepage-showcase/index.tsx'),
  route('advertising-solutions', 'routes/advertising-solutions/index.tsx'),
  route('book', 'routes/book.tsx'), // Book It page
  route('book/performer', 'routes/book/performer.tsx'), // Book performer
  route('book-it', 'routes/book-it/index.tsx'),
  route('book-it/gigs', 'routes/book-it/gigs/index.tsx'),
  route('book-it/venues', 'routes/book-it/venues/index.tsx'),
  route('book-it/venues/:id', 'routes/book-it/venues/$id/index.tsx'),
  route('book-it/venues/:id/book', 'routes/book-it/venues/$id/book/index.tsx'),
  route('bookings', 'routes/bookings/index.tsx'),
  route('bookings/confirmation', 'routes/bookings/confirmation/index.tsx'),
  route('c/:communitySlug', 'routes/c.$communitySlug.tsx'),
  route('calendars', 'routes/calendars/index.tsx'),
  route('calendars/marketplace', 'routes/calendars/marketplace.tsx'),
  route('careers', 'routes/careers/index.tsx'),
  route('community-impact', 'routes/community-impact/index.tsx'),
  route('contact', 'routes/contact/index.tsx'),
  route('events', 'routes/events/index.tsx'),
  route('gear', 'routes/gear/index.tsx'),
  route('help', 'routes/help/index.tsx'),
  route('how-it-works', 'routes/how-it-works/index.tsx'),
  route('hubs', 'routes/hubs.tsx'), // Communities (hubs)
  route('messages', 'routes/messages/index.tsx'),
  route('notifications', 'routes/notifications/index.tsx'),
  route('partner', 'routes/partner/index.tsx'),
  route('performers', 'routes/performers.tsx'),
  route('press', 'routes/press/index.tsx'),
  route('social', 'routes/social.tsx'), // Social feed
  route('social/notifications', 'routes/social/notifications.tsx'),
  route('social/messages', 'routes/social/messages.tsx'),
  route('success-stories', 'routes/success-stories/index.tsx'),
  route('tickets', 'routes/tickets/index.tsx'),
  route('tickets/:id', 'routes/tickets/$id/index.tsx'),
  route('tickets/buy', 'routes/tickets/buy.tsx'), // Ticket buying
  route('tickets/marketplace', 'routes/tickets/marketplace/index.tsx'),
  route('venues', 'routes/venues.tsx'),
  route('venues/:id', 'routes/venues.$id.tsx'),
  route('events/:id', 'routes/events.$id.tsx'),
  route('performers/:id', 'routes/performers.$id.tsx'),
  route('*', 'routes/$.tsx'), // Catch-all 404 route
]);

// Makerkit marketing routes with layout
const marketingLayout = layout('routes/marketing/layout.tsx', [
  route('terms-of-service', 'routes/marketing/terms-of-service.tsx'),
  route('privacy-policy', 'routes/marketing/privacy-policy.tsx'),
  route('pricing', 'routes/marketing/pricing.tsx'),
  route('faq', 'routes/marketing/faq.tsx'),
  route('blog', 'routes/marketing/blog/index.tsx'),
  route('blog/:slug', 'routes/marketing/blog/$slug.tsx'),
  route('cookie-policy', 'routes/marketing/cookie-policy.tsx'),
  layout('routes/marketing/docs/layout.tsx', [
    route('docs', 'routes/marketing/docs/index.tsx'),
    route('docs/*', 'routes/marketing/docs/$slug.tsx'),
  ]),
]);

const authLayout = layout('routes/auth/layout.tsx', [
  route('auth/sign-in', 'routes/auth/sign-in.tsx'),
  route('auth/sign-up', 'routes/auth/sign-up.tsx'),
  route('auth/password-reset', 'routes/auth/password-reset.tsx'),
  route('auth/verify', 'routes/auth/verify.tsx'),
  route('auth/callback', 'routes/auth/callback.tsx'),
  route('auth/callback/error', 'routes/auth/callback-error.tsx'),
  route('auth/confirm', 'routes/auth/confirm.tsx'),
]);

const adminLayout = layout('routes/admin/layout.tsx', [
  route('admin', 'routes/admin/index.tsx'),
  route('admin/accounts', 'routes/admin/accounts/index.tsx'),
  route('admin/accounts/:account', 'routes/admin/accounts/$account.tsx'),
]);

const userAccountLayout = layout('routes/home/user/layout.tsx', [
  route('home', 'routes/home/user/index.tsx'),
  route('home/settings', 'routes/home/user/settings.tsx'),
  route('home/billing', 'routes/home/user/billing.tsx'),
  route('home/billing/return', 'routes/home/user/billing-return.tsx'),
]);

const teamAccountLayout = layout('routes/home/account/layout.tsx', [
  route('home/:account', 'routes/home/account/index.tsx'),
  route('home/:account/settings', 'routes/home/account/settings.tsx'),
  route('home/:account/members', 'routes/home/account/members.tsx'),
  route('home/:account/billing', 'routes/home/account/billing.tsx'),
  route(
    'home/:account/billing/return',
    'routes/home/account/billing-return.tsx',
  ),
]);

export default [
  ...rootRoutes,
  ...apiRoutes,
  magicPatternsLayout,
  adminLayout,
  marketingLayout,
  authLayout,
  userAccountLayout,
  teamAccountLayout,
] satisfies RouteConfig;

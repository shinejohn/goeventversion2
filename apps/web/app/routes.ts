import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

/**
 * Refactored routes.ts for Magic Patterns UI with Makerkit backend
 * 
 * Architecture:
 * - Magic Patterns handles ALL UI components
 * - Makerkit provides auth, database, billing infrastructure
 * - React Router 7 for routing with SSR support
 */

// System routes (no UI needed)
const systemRoutes = [
  route('robots.txt', 'routes/robots/route.tsx'),
  route('sitemap.xml', 'routes/sitemap/route.tsx'),
  route('version', 'routes/version.ts'),
  route('healthcheck', 'routes/healthcheck.ts'),
];

// API routes (Makerkit backend functionality)
const apiRoutes = [
  route('api/accounts', 'routes/api/accounts.ts'),
  route('api/billing/checkout', 'routes/api/billing/checkout.ts'),
  route('api/billing/webhook', 'routes/api/billing/webhook.ts'),
  route('api/db/webhook', 'routes/api/db/webhook.ts'),
  route('api/otp/send', 'routes/api/otp/send.ts'),
  route('api/checkin', 'routes/api/checkin.ts'),
];

// Magic Patterns Public Layout (Header + Footer)
const magicPatternsPublicLayout = layout('routes/layouts/magic-patterns-public.tsx', [
  // Landing & Marketing
  index('routes/index.tsx'),
  route('about', 'routes/about/index.tsx'),
  route('contact', 'routes/contact/index.tsx'),
  route('how-it-works', 'routes/how-it-works/index.tsx'),
  route('careers', 'routes/careers/index.tsx'),
  route('press', 'routes/press/index.tsx'),
  route('success-stories', 'routes/success-stories/index.tsx'),
  route('community-impact', 'routes/community-impact/index.tsx'),
  route('partner', 'routes/partner/index.tsx'),
  route('help', 'routes/help/index.tsx'),
  route('faq', 'routes/marketing/faq.tsx'),
  
  // Advertising
  route('advertise', 'routes/advertise/index.tsx'),
  route('advertise/packages', 'routes/advertise/packages/index.tsx'),
  route('advertise/email-campaigns', 'routes/advertise/email-campaigns/index.tsx'),
  route('advertise/event-promotion', 'routes/advertise/event-promotion/index.tsx'),
  route('advertise/featured-listings', 'routes/advertise/featured-listings/index.tsx'),
  route('advertise/homepage-showcase', 'routes/advertise/homepage-showcase/index.tsx'),
  route('advertising-solutions', 'routes/advertising-solutions/index.tsx'),
  
  // Pricing
  route('pricing', 'routes/pricing/index.tsx'),
  
  // Legal pages (can use simple layout)
  route('terms-of-service', 'routes/marketing/terms-of-service.tsx'),
  route('privacy-policy', 'routes/marketing/privacy-policy.tsx'),
  route('cookie-policy', 'routes/marketing/cookie-policy.tsx'),
  
  // Blog/Docs (optional - can keep Makerkit if needed)
  route('blog', 'routes/marketing/blog/index.tsx'),
  route('blog/:slug', 'routes/marketing/blog/$slug.tsx'),
  route('docs', 'routes/marketing/docs/index.tsx'),
  route('docs/*', 'routes/marketing/docs/$slug.tsx'),
  
  // Public discovery pages
  route('venues', 'routes/venues/index.tsx'),
  route('venues/:id', 'routes/venues/$id.tsx'),
  route('venues/submit', 'routes/venues/submit.tsx'),
  route('venues/trending', 'routes/venues/trending.tsx'),
  route('venues/new', 'routes/venues/new.tsx'),
  route('venues/listings', 'routes/venues/listings.tsx'),
  
  route('events', 'routes/events/index.tsx'),
  route('events/:id', 'routes/events/$id.tsx'),
  
  route('performers', 'routes/performers/index.tsx'),
  route('performers/:id', 'routes/performers/$id.tsx'),
  
  route('hubs', 'routes/hubs/index.tsx'),
  route('hub/:slug', 'routes/hub/$slug/index.tsx'),
  route('hub/:slug/events', 'routes/hub/$slug/events.tsx'),
  route('hub/:slug/venues', 'routes/hub/$slug/venues.tsx'),
  route('hub/:slug/gallery', 'routes/hub/$slug/gallery.tsx'),
  
  route('calendars', 'routes/calendars/index.tsx'),
  route('calendars/marketplace', 'routes/calendars/marketplace.tsx'),
  route('calendars/:slug', 'routes/calendars/$slug.tsx'),
  
  route('gear', 'routes/gear/index.tsx'),
  
  route('tickets', 'routes/tickets/index.tsx'),
  route('tickets/marketplace', 'routes/tickets/marketplace/index.tsx'),
  
  // Community
  route('c/:communitySlug', 'routes/c.$communitySlug.tsx'),
  
  // Social features
  route('social', 'routes/social/index.tsx'),
  route('social/feed', 'routes/social/feed.tsx'),
  route('social/notifications', 'routes/social/notifications.tsx'),
  route('social/messages', 'routes/social/messages.tsx'),
  
  // Test routes (development only)
  ...(process.env.NODE_ENV === 'development' ? [
    route('test-venues', 'routes/test-venues.tsx'),
  ] : []),
]);

// Magic Patterns Auth Layout (minimal, centered)
const magicPatternsAuthLayout = layout('routes/layouts/magic-patterns-auth.tsx', [
  route('auth/login', 'routes/auth/login.tsx'),
  route('auth/signup', 'routes/auth/signup.tsx'),
  route('auth/sign-in', 'routes/auth/sign-in.tsx'),
  route('auth/sign-up', 'routes/auth/sign-up.tsx'),
  route('auth/forgot-password', 'routes/auth/forgot-password.tsx'),
  route('auth/password-reset', 'routes/auth/password-reset.tsx'),
  route('auth/social-login', 'routes/auth/social-login.tsx'),
  route('auth/password-reset-security', 'routes/auth/password-reset-security.tsx'),
  route('auth/password-security', 'routes/auth/password-security.tsx'),
  route('auth/2fa-setup', 'routes/auth/2fa-setup.tsx'),
  route('auth/verify', 'routes/auth/verify.tsx'),
  route('auth/callback', 'routes/auth/callback.tsx'),
  route('auth/callback/error', 'routes/auth/callback-error.tsx'),
  route('auth/confirm', 'routes/auth/confirm.tsx'),
  route('update-password', 'routes/update-password.tsx'),
  route('join', 'routes/join.tsx'), // Invitation flow
]);

// Magic Patterns Dashboard Layout (with sidebar)
const magicPatternsDashboardLayout = layout('routes/layouts/magic-patterns-dashboard.tsx', [
  // User dashboard (personal account)
  route('home', 'routes/home/user/index.tsx'),
  route('home/settings', 'routes/home/user/settings.tsx'),
  route('home/billing', 'routes/home/user/billing.tsx'),
  route('home/billing/return', 'routes/home/user/billing-return.tsx'),
  
  // Team account dashboard
  route('home/:account', 'routes/home/account/index.tsx'),
  route('home/:account/settings', 'routes/home/account/settings.tsx'),
  route('home/:account/members', 'routes/home/account/members.tsx'),
  route('home/:account/billing', 'routes/home/account/billing.tsx'),
  route(
    'home/:account/billing/return',
    'routes/home/account/billing-return.tsx',
  ),
  
  // Role-specific dashboards
  route('dashboard/venue-owner', 'routes/dashboard/venue-owner.tsx'),
  route('dashboard/performer/calendar', 'routes/dashboard/performer/calendar.tsx'),
  route('dashboard/performer/portfolio', 'routes/dashboard/performer/portfolio.tsx'),
  route('dashboard/performer/bookings', 'routes/dashboard/performer/bookings.tsx'),
  route('dashboard/fan', 'routes/dashboard/fan.tsx'),
  route('dashboard/organizer', 'routes/dashboard/organizer.tsx'),
  route('dashboard/organizer/events', 'routes/dashboard/organizer/events.tsx'),
  route('dashboard/analytics', 'routes/dashboard/analytics.tsx'),
  
  // Settings (within dashboard)
  route('settings/notifications', 'routes/settings/notifications.tsx'),
  route('settings/privacy', 'routes/settings/privacy.tsx'),
  route('settings/account', 'routes/settings/account.tsx'),
  route('settings/security', 'routes/settings/security.tsx'),
  route('settings/data-export', 'routes/settings/data-export.tsx'),
  route('settings/visibility', 'routes/settings/visibility.tsx'),
  route('settings/preferences', 'routes/settings/preferences.tsx'),
  
  // Profile management
  route('profile/edit', 'routes/profile/edit.tsx'),
  route('profile/customize', 'routes/profile/customize.tsx'),
  
  // Billing (within dashboard)
  route('billing/invoice/:id', 'routes/billing/invoice/$id.tsx'),
  route('billing/subscription', 'routes/billing/subscription.tsx'),
  route('billing/payment-methods', 'routes/billing/payment-methods.tsx'),
  route('billing/history', 'routes/billing/history.tsx'),
  
  // Booking management (within dashboard)
  route('bookings', 'routes/bookings/index.tsx'),
  route('bookings/:id', 'routes/bookings/$id.tsx'),
  route('booking/calendar', 'routes/booking/calendar.tsx'),
  route('booking/manage', 'routes/booking/manage.tsx'),
  
  // Event management (within dashboard)
  route('events/create', 'routes/events/create.tsx'),
  route('events/manage/:id', 'routes/events/manage/$id.tsx'),
  
  // Venue management (within dashboard)
  route('venues/management', 'routes/venues/management.tsx'),
  
  // Hub management (within dashboard)
  route('hubs/create', 'routes/hubs/create.tsx'),
  route('hub/create', 'routes/hub/create.tsx'),
  route('hub/:slug/analytics', 'routes/hub/$slug/analytics.tsx'),
  
  // Calendar creation (within dashboard)
  route('calendars/create', 'routes/calendars/create.tsx'),
  
  // Messages & Notifications
  route('messages', 'routes/messages/index.tsx'),
  route('notifications', 'routes/notifications/index.tsx'),
]);

// Magic Patterns Admin Layout
const magicPatternsAdminLayout = layout('routes/layouts/magic-patterns-admin.tsx', [
  route('admin', 'routes/admin/index.tsx'),
  route('admin/accounts', 'routes/admin/accounts/index.tsx'),
  route('admin/accounts/:account', 'routes/admin/accounts/$account.tsx'),
  route('admin/venue-management', 'routes/admin/venue-management.tsx'),
]);

// Booking flow with its own layout (wizard-style)
const bookingFlowLayout = layout('routes/layouts/booking-flow.tsx', [
  route('book', 'routes/book.tsx'),
  route('book/performer', 'routes/book/performer.tsx'),
  route('book-it', 'routes/book-it/index.tsx'),
  route('book-it/gigs', 'routes/book-it/gigs/index.tsx'),
  route('book-it/venues', 'routes/book-it/venues/index.tsx'),
  route('book-it/venues/:id', 'routes/book-it/venues/$id/index.tsx'),
  route('book-it/venues/:id/book', 'routes/book-it/venues/$id/book/index.tsx'),
  route('venues/:id/book', 'routes/venues/$id/book.tsx'),
  
  // Booking flow steps
  route('book/event-details', 'routes/book/event-details.tsx'),
  route('book/requirements', 'routes/book/requirements.tsx'),
  route('book/services', 'routes/book/services.tsx'),
  route('book/payment', 'routes/book/payment.tsx'),
  route('book/review', 'routes/book/review.tsx'),
  route('book/confirmation', 'routes/book/confirmation.tsx'),
  route('book/success', 'routes/book/success.tsx'),
  route('bookings/confirmation', 'routes/bookings/confirmation/index.tsx'),
]);

// Checkout flow (separate from booking)
const checkoutFlowLayout = layout('routes/layouts/checkout-flow.tsx', [
  route('checkout/payment', 'routes/checkout/payment.tsx'),
  route('tickets/buy', 'routes/tickets/buy.tsx'),
  route('tickets/purchase/:eventId', 'routes/tickets/purchase/$eventId.tsx'),
  route('tickets/:id', 'routes/tickets/$id/index.tsx'),
]);

// Catch-all for 404
const catchAllRoute = route('*', 'routes/$.tsx');

export default [
  ...systemRoutes,
  ...apiRoutes,
  magicPatternsPublicLayout,
  magicPatternsAuthLayout,
  magicPatternsDashboardLayout,
  magicPatternsAdminLayout,
  bookingFlowLayout,
  checkoutFlowLayout,
  catchAllRoute,
] satisfies RouteConfig;

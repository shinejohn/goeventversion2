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
  
  // NEWLY IMPLEMENTED MAGIC PATTERNS ROUTES
  route('auth/social-login', 'routes/auth/social-login.tsx'), // Social media login options (Google, Facebook, Apple)
  route('auth/password-reset-security', 'routes/auth/password-reset-security.tsx'), // Password reset form with security features
  route('auth/password-security', 'routes/auth/password-security.tsx'), // Password security settings and requirements
  route('auth/login', 'routes/auth/login.tsx'), // Main login page with email/password and social options
  route('auth/signup', 'routes/auth/signup.tsx'), // User registration with email verification
  route('auth/forgot-password', 'routes/auth/forgot-password.tsx'), // Password recovery workflow
  route('auth/2fa-setup', 'routes/auth/2fa-setup.tsx'), // Two-factor authentication setup and management
  route('billing/invoice/:id', 'routes/billing/invoice/$id.tsx'), // Invoice display and download functionality
  route('billing/subscription', 'routes/billing/subscription.tsx'), // Subscription management and plan selection
  route('pricing', 'routes/pricing/index.tsx'), // Pricing plans and feature comparison
  route('billing/payment-methods', 'routes/billing/payment-methods.tsx'), // Manage credit cards and payment methods
  route('billing/history', 'routes/billing/history.tsx'), // Transaction history and receipts
  route('checkout/payment', 'routes/checkout/payment.tsx'), // Secure payment processing with Stripe integration
  route('dashboard/venue-owner', 'routes/dashboard/venue-owner.tsx'), // Comprehensive venue owner management dashboard
  route('dashboard/performer/calendar', 'routes/dashboard/performer/calendar.tsx'), // Performer booking calendar and availability
  route('dashboard/performer/portfolio', 'routes/dashboard/performer/portfolio.tsx'), // Performer portfolio and media gallery
  route('dashboard/performer/bookings', 'routes/dashboard/performer/bookings.tsx'), // Performer booking management
  route('dashboard/fan', 'routes/dashboard/fan.tsx'), // Fan dashboard with favorites and recommendations
  route('dashboard/organizer', 'routes/dashboard/organizer.tsx'), // Event organizer management dashboard
  route('dashboard/organizer/events', 'routes/dashboard/organizer/events.tsx'), // Organizer event management hub
  route('admin/venue-management', 'routes/admin/venue-management.tsx'), // System admin venue oversight and management
  route('dashboard/layout', 'routes/dashboard/layout.tsx'), // Shared dashboard layout with navigation
  route('dashboard/analytics', 'routes/dashboard/analytics.tsx'), // Business analytics and performance metrics
  route('settings/notifications', 'routes/settings/notifications.tsx'), // Notification preferences and settings
  route('settings/privacy', 'routes/settings/privacy.tsx'), // Privacy controls and data management
  route('profile/edit', 'routes/profile/edit.tsx'), // Edit personal profile information
  route('settings/account', 'routes/settings/account.tsx'), // Account settings and preferences
  route('profile/customize', 'routes/profile/customize.tsx'), // Customize profile appearance and layout
  route('settings/preferences', 'routes/settings/preferences.tsx'), // User experience preferences
  route('settings/security', 'routes/settings/security.tsx'), // Account security and authentication settings
  route('settings/data-export', 'routes/settings/data-export.tsx'), // Export personal data and account information
  route('settings/visibility', 'routes/settings/visibility.tsx'), // Control profile visibility and public information
  route('events/create', 'routes/events/create.tsx'), // Create new events with full customization
  route('venues/listings', 'routes/venues/listings.tsx'), // Browse and search venue listings
  route('events/manage/:id', 'routes/events/manage/$id.tsx'), // Comprehensive event management tools
  route('booking/calendar', 'routes/booking/calendar.tsx'), // Interactive booking calendar with availability
  route('booking/manage', 'routes/booking/manage.tsx'), // Manage all bookings and reservations

      // PHASE 1: Core Booking Experience (Revenue Critical)
  layout('routes/book/layout.tsx', [
    route('book/event-details', 'routes/book/event-details.tsx'),
    route('book/requirements', 'routes/book/requirements.tsx'),
    route('book/services', 'routes/book/services.tsx'),
    route('book/payment', 'routes/book/payment.tsx'),
    route('book/review', 'routes/book/review.tsx'),
    route('book/confirmation', 'routes/book/confirmation.tsx'),
    route('book/success', 'routes/book/success.tsx'),
  ]),
  
  // Legacy book routes (maintain compatibility)
  route('book', 'routes/book.tsx'), // Book It page
  route('book/performer', 'routes/book/performer.tsx'), // Book performer
  route('book-it', 'routes/book-it/index.tsx'),
  route('book-it/gigs', 'routes/book-it/gigs/index.tsx'),
  route('book-it/venues', 'routes/book-it/venues/index.tsx'),
  route('book-it/venues/:id', 'routes/book-it/venues/$id/index.tsx'),
  route('book-it/venues/:id/book', 'routes/book-it/venues/$id/book/index.tsx'),
  
  // Booking Management
  route('bookings', 'routes/bookings/index.tsx'),
  route('bookings/:id', 'routes/bookings/$id.tsx'),
  route('bookings/confirmation', 'routes/bookings/confirmation/index.tsx'),
  
  route('c/:communitySlug', 'routes/c.$communitySlug.tsx'),
  route('calendars', 'routes/calendars/index.tsx'),
  route('calendars/marketplace', 'routes/calendars/marketplace.tsx'),
  route('careers', 'routes/careers/index.tsx'),
  route('community-impact', 'routes/community-impact/index.tsx'),
  route('contact', 'routes/contact/index.tsx'),
  
  // PHASE 2: Event Discovery & Navigation
  route('events', 'routes/events/index.tsx'),
  route('events/:id', 'routes/events/$id.tsx'),
  
  route('gear', 'routes/gear/index.tsx'),
  route('help', 'routes/help/index.tsx'),
  route('how-it-works', 'routes/how-it-works/index.tsx'),
  
  // PHASE 3: Community & Social Features
  route('hubs', 'routes/hubs/index.tsx'),
  route('hubs/create', 'routes/hubs/create.tsx'),
  
  route('messages', 'routes/messages/index.tsx'),
  route('notifications', 'routes/notifications/index.tsx'),
  route('partner', 'routes/partner/index.tsx'),
  
  // Performers
  route('performers', 'routes/performers/index.tsx'),
  route('performers/:id', 'routes/performers/$id.tsx'),
  
  route('press', 'routes/press/index.tsx'),
  
  // Social Features
  route('social', 'routes/social/index.tsx'),
  route('social/notifications', 'routes/social/notifications.tsx'),
  route('social/messages', 'routes/social/messages.tsx'),
  
  route('success-stories', 'routes/success-stories/index.tsx'),
  route('tickets', 'routes/tickets/index.tsx'),
  route('tickets/:id', 'routes/tickets/$id/index.tsx'),
  route('tickets/buy', 'routes/tickets/buy.tsx'), // Ticket buying
  route('tickets/marketplace', 'routes/tickets/marketplace/index.tsx'),
  
  // Venues  
  route('venues', 'routes/venues/index.tsx'),
  route('venues/:id', 'routes/venues/$id.tsx'),
  
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

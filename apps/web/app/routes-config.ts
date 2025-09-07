import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

// Centralized route configuration with clear separation of concerns
export const routeConfig = {
  // API routes prefix
  api: 'api',
  
  // Auth routes prefix
  auth: 'auth',
  
  // Admin routes prefix
  admin: 'admin',
  
  // User dashboard routes prefix
  home: 'home',
  
  // Public routes
  public: {
    venues: 'venues',
    events: 'events',
    performers: 'performers',
    hubs: 'hubs',
    booking: 'booking',
  },
} as const;

// Route factory functions for consistent patterns
export function createCrudRoutes(resource: string, basePath: string) {
  return [
    route(basePath, `routes/${resource}/index.tsx`),
    route(`${basePath}/create`, `routes/${resource}/create.tsx`),
    route(`${basePath}/:id`, `routes/${resource}/$id.tsx`),
    route(`${basePath}/:id/edit`, `routes/${resource}/$id/edit.tsx`),
  ];
}

export function createResourceRoutes(resource: string, basePath: string, additionalRoutes: Array<{ path: string; file: string }> = []) {
  const baseRoutes = createCrudRoutes(resource, basePath);
  const additional = additionalRoutes.map(({ path, file }) => 
    route(`${basePath}/${path}`, `routes/${resource}/${file}`)
  );
  return [...baseRoutes, ...additional];
}

// Auth route configuration - single source of truth
export const authRoutes = {
  signIn: 'auth/sign-in',
  signUp: 'auth/sign-up',
  passwordReset: 'auth/password-reset',
  verify: 'auth/verify',
  callback: 'auth/callback',
  callbackError: 'auth/callback/error',
  confirm: 'auth/confirm',
  // Magic Patterns auth routes
  socialLogin: 'auth/social-login',
  forgotPassword: 'auth/forgot-password',
  twoFactorSetup: 'auth/2fa-setup',
} as const;

// API route configuration
export const apiRoutes = {
  accounts: 'api/accounts',
  billingCheckout: 'api/billing/checkout',
  billingWebhook: 'api/billing/webhook',
  dbWebhook: 'api/db/webhook',
  otpSend: 'api/otp/send',
  checkin: 'api/checkin',
} as const;

// Venue route configuration
export const venueRoutes = {
  index: 'venues',
  detail: 'venues/:id',
  book: 'venues/:id/book',
  submit: 'venues/submit',
  management: 'venues/management',
  trending: 'venues/trending',
  new: 'venues/new',
  listings: 'venues/listings',
} as const;

// Event route configuration  
export const eventRoutes = {
  index: 'events',
  detail: 'events/:id',
  create: 'events/create',
  manage: 'events/manage/:id',
} as const;

// Booking route configuration
export const bookingRoutes = {
  index: 'bookings',
  detail: 'bookings/:id',
  confirmation: 'bookings/confirmation',
  calendar: 'booking/calendar',
  manage: 'booking/manage',
  // Booking flow steps
  eventDetails: 'book/event-details',
  requirements: 'book/requirements',
  services: 'book/services',
  payment: 'book/payment',
  review: 'book/review',
  success: 'book/success',
} as const;

// Hub route configuration
export const hubRoutes = {
  index: 'hubs',
  create: 'hubs/create',
  detail: 'hub/:slug',
  events: 'hub/:slug/events',
  venues: 'hub/:slug/venues',
  analytics: 'hub/:slug/analytics',
  gallery: 'hub/:slug/gallery',
} as const;

// Dashboard route configuration
export const dashboardRoutes = {
  venueOwner: 'dashboard/venue-owner',
  performer: {
    calendar: 'dashboard/performer/calendar',
    portfolio: 'dashboard/performer/portfolio',
    bookings: 'dashboard/performer/bookings',
  },
  fan: 'dashboard/fan',
  organizer: {
    index: 'dashboard/organizer',
    events: 'dashboard/organizer/events',
  },
  analytics: 'dashboard/analytics',
} as const;

// Settings route configuration
export const settingsRoutes = {
  notifications: 'settings/notifications',
  privacy: 'settings/privacy',
  account: 'settings/account',
  security: 'settings/security',
  dataExport: 'settings/data-export',
  visibility: 'settings/visibility',
  preferences: 'settings/preferences',
} as const;

// Billing route configuration
export const billingRoutes = {
  invoice: 'billing/invoice/:id',
  subscription: 'billing/subscription',
  paymentMethods: 'billing/payment-methods',
  history: 'billing/history',
} as const;
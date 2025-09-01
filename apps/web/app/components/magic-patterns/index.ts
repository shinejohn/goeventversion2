// Auto-generated component registry
// DO NOT EDIT - Run 'pnpm analyze:mp' to regenerate

export const MagicPatternsComponents = {
  'help': () => import('./pages/help.tsx'),
  'logout': () => import('./pages/logout.tsx'),
  'CheckInButton': () => import('./components/check-in/CheckInButton.tsx'),
  'CheckInFeed': () => import('./components/check-in/CheckInFeed.tsx'),
  'CheckInModal': () => import('./components/check-in/CheckInModal.tsx'),
  'PlannedEventsWidget': () => import('./components/check-in/PlannedEventsWidget.tsx'),
  'Invoice': () => import('./components/checkout/Invoice.tsx'),
  'TicketPurchaseConfirmation': () => import('./components/tickets/TicketPurchaseConfirmation.tsx'),
  '[slug]': () => import('./pages/calendar/[slug].tsx'),
  'create': () => import('./pages/calendars/create.tsx'),
  'create': () => import('./pages/hub/create.tsx'),
  'calendar': () => import('./pages/my/calendar.tsx'),
  'dashboard': () => import('./pages/my/dashboard.tsx'),
  'venues': () => import('./pages/my/venues.tsx'),
  'FeedPage': () => import('./pages/social/FeedPage.tsx'),
  'FriendsPage': () => import('./pages/social/FriendsPage.tsx'),
  'GroupsPage': () => import('./pages/social/GroupsPage.tsx'),
  'MessagesPage': () => import('./pages/social/MessagesPage.tsx'),
  'NotificationsPage': () => import('./pages/social/NotificationsPage.tsx'),
  'SocialFeedPage': () => import('./pages/social/SocialFeedPage.tsx'),
  'TicketMarketplacePage': () => import('./pages/tickets/TicketMarketplacePage.tsx'),
  'edit': () => import('./pages/calendar/[id]/edit.tsx'),
  'edit': () => import('./pages/hub/[id]/edit.tsx'),
  'analytics': () => import('./pages/hub/[slug]/analytics.tsx'),
  'community': () => import('./pages/hub/[slug]/community.tsx'),
  'gallery': () => import('./pages/hub/[slug]/gallery.tsx'),
  'performers': () => import('./pages/hub/[slug]/performers.tsx'),
  'venues': () => import('./pages/hub/[slug]/venues.tsx'),
  '[venueSlug]': () => import('./pages/venues/[venueId]/[venueSlug].tsx'),
  'book': () => import('./pages/venues/[venueId]/book.tsx'),
} as const;

export type MagicPatternsComponentName = keyof typeof MagicPatternsComponents;

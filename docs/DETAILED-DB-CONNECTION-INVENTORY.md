# Database Connection Inventory Report

Total routes analyzed: 262

## Summary:
- ✅ Fully connected to database: 60 (23%)
- ⚠️  Partially connected: 127 (48%)
- ❌ Static pages: 75 (29%)
- 🎨 Magic Patterns pages: 128

## Fully Connected Pages (with working database access):

### test-magic-ssr.tsx
- Tables: events
- Magic Patterns Component: HomePage

### submit-event.tsx
- Tables: venues, event_categories, events
- Magic Patterns Component: SubmitEventPage

### social.tsx
- Tables: social_posts, friendships, events
- Magic Patterns Component: createMagicPatternsRoute

### index.tsx
- Tables: events, venues, performers
- Magic Patterns Component: HomePage

### streaming/live.tsx
- Tables: events
- Magic Patterns Component: LiveStreamingEventsPage

### streaming/index.tsx
- Tables: live_streams
- Magic Patterns Component: VideoStreamingPage

### venues/new.tsx
- Tables: venues
- Magic Patterns Component: SubmitVenuePage

### venues/listings.tsx
- Tables: venues
- Magic Patterns Component: FeaturedListingsPage

### venues/list-your-venue.tsx
- Tables: venues
- Magic Patterns Component: ListYourVenuePage

### venues/index.tsx
- Tables: venues
- Magic Patterns Component: VenuesPage

### venues/$venueId.tsx
- Tables: venues
- Magic Patterns Component: VenueProfilePage

### venues/$id.tsx
- Tables: venues, events, bookings
- Magic Patterns Component: VenueDetailPage

### tickets/purchase.tsx
- Tables: events, accounts, tickets
- Magic Patterns Component: TicketPurchasePage

### tickets/index.tsx
- Tables: events
- Magic Patterns Component: TicketsPage

### profile/edit.tsx
- Tables: accounts, liked_venues, liked_performers, shared_calendars, user_preferences, social_links
- Magic Patterns Component: UserProfileSettingsPage

### profile/customize.tsx
- Tables: accounts, friendships, bookings, liked_venues, liked_performers, event_comments, shared_calendars, user_preferences
- Magic Patterns Component: UserProfilePage

### performers/new.tsx
- Tables: performers
- Magic Patterns Component: CreatePerformerPage

### performers/index.tsx
- Tables: performers
- Magic Patterns Component: PerformersPage

### performers/$performerId.tsx
- Tables: performers
- Magic Patterns Component: PerformerProfilePage

### performers/$id.tsx
- Tables: performers, event_performers
- Magic Patterns Component: PerformerProfilePage

### social/index.tsx
- Tables: social_posts
- Magic Patterns Component: null

### social/feed.tsx
- Tables: social_posts
- Magic Patterns Component: null

### messages/index.tsx
- Tables: messages
- Magic Patterns Component: MessagesPage

### hubs/index.tsx
- Tables: community_hubs
- Magic Patterns Component: null

### my/calendar.tsx
- Tables: bookings, calendar_shares, shared_calendars, event_reminders
- Magic Patterns Component: createMagicPatternsRoute

### gear/index.tsx
- Tables: product_categories, products
- Magic Patterns Component: GearPage

### calendars/index.tsx
- Tables: events, bookings
- Magic Patterns Component: CalendarPage

### calendars/$slug.tsx
- Tables: calendars

### bookings/index.tsx
- Tables: bookings
- Magic Patterns Component: BookingsPage

### bookings/$id.tsx
- Tables: bookings
- Magic Patterns Component: BookingSummaryCard

### events/new.tsx
- Tables: venues, performers, events
- Magic Patterns Component: CreateEventPage

### events/index.tsx
- Tables: events, venues
- Magic Patterns Component: EventsPage

### events/create.tsx
- Tables: venues, accounts, events

### events/$id.tsx
- Tables: events, event_performers, bookings
- Magic Patterns Component: EventDetailPage

### book-it/index.tsx
- Tables: venues, events, performers
- Magic Patterns Component: BookItPage

### community/index.tsx
- Tables: community_hubs, hub_memberships
- Magic Patterns Component: CommunityPage

### artists/index.tsx
- Tables: artists
- Magic Patterns Component: ArtistProfilesPage

### calendar/$slug.tsx
- Tables: calendars
- Magic Patterns Component: CalendarSlugPage

### book/success.tsx
- Tables: bookings
- Magic Patterns Component: BookingConfirmation

### book/services.tsx
- Tables: booking_sessions, events, venues
- Magic Patterns Component: ServicesAddonsForm

### book/review.tsx
- Tables: booking_sessions, events, venues
- Magic Patterns Component: ReviewStep

### book/requirements.tsx
- Tables: booking_sessions, events, venues
- Magic Patterns Component: RequirementsStep

### book/payment.tsx
- Tables: booking_sessions, events, venues
- Magic Patterns Component: ContactPaymentForm

### book/layout.tsx
- Tables: booking_sessions
- Magic Patterns Component: ProgressIndicator

### book/event-details.tsx
- Tables: booking_sessions, events, venues
- Magic Patterns Component: EventDetailsStep

### book/confirmation.tsx
- Tables: booking_sessions, events, venues
- Magic Patterns Component: ConfirmationStep

### tickets/purchase/$eventId.tsx
- Tables: events

### venues/$id/book.tsx
- Tables: venues
- Magic Patterns Component: BookingRequestPage

### shop/product/$id.tsx
- Tables: products
- Magic Patterns Component: ProductDetailPage

### hub/$slug/venues.tsx
- Tables: hubs, venues
- Magic Patterns Component: null

### hub/$slug/index.tsx
- Tables: hubs, hub_members, hub_activities
- Magic Patterns Component: null

### hub/$slug/gallery.tsx
- Tables: hubs, hub_gallery
- Magic Patterns Component: null

### hub/$slug/events.tsx
- Tables: hubs, events
- Magic Patterns Component: HubEventsPage

### hub/$slug/analytics.tsx
- Tables: hubs, events, hub_members
- Magic Patterns Component: null

### home/user/index.tsx
- Tables: performers, events, bookings

### book-it/venues/index.tsx
- Tables: venues
- Magic Patterns Component: VenueMarketplacePage

### book-it/gigs/index.tsx
- Tables: performers
- Magic Patterns Component: GigMarketplacePage

### admin/accounts/index.tsx
- Tables: accounts

### book-it/venues/$id/index.tsx
- Tables: venues, events
- Magic Patterns Component: VenueDetailPage

### book-it/venues/$id/book/index.tsx
- Tables: venues
- Magic Patterns Component: BookingRequestPage

## Partially Connected Pages (incomplete database setup):

### version.ts
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### update-password.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### page-directory.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: PageDirectory

### logout.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: null

### join.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### healthcheck.ts
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### venues/create.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: accounts, venues

### venues/$venueId.book.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: accounts, bookings

### tickets/selection.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: TicketSelectionPage

### success-stories/urban-loft.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: UrbanLoftPage

### success-stories/sunset-music-festival.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: SunsetMusicFestivalPage

### success-stories/jazz-quartet.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: JazzQuartetPage

### success-stories/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: SuccessStoriesPage

### sitemap/route.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### robots/route.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### settings/visibility.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### settings/security.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### settings/privacy.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### settings/preferences.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### settings/notifications.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: NotificationsPage

### settings/data-export.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### settings/account.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### press/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: PressMediaPage

### performers/profile-simple.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: PerformerProfilePageSimple

### performers/create.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: accounts, performers

### partner/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: PartnerWithUsPage

### pricing/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### social/groups.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: GroupsPage

### social/friends.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: FriendsPage

### notifications/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: NotificationsPage

### shop/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: GearPage

### hubs/overview-metrics.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: OverviewMetrics

### hubs/member-insights.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: MemberInsights

### hubs/hub-articles-page.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: HubArticlesPage

### hubs/gallery.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### hubs/create.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: community_hubs
- Magic Patterns Component: SetupWizard

### hubs/content-performance.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: ContentPerformance

### hubs/community-impact-page.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: CommunityImpactPage

### my/venues.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: null

### my/dashboard.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: null

### marketing/terms-of-service.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/privacy-policy.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/pricing.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/layout.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: MainHeader

### marketing/faq.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/cookie-policy.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### how-it-works/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: HowItWorksPage

### help/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: HelpPage

### hub/create.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: null

### dashboard/venue-owner.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: VenueOwnerDashboard

### dashboard/organizer.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### dashboard/layout.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### dashboard/fan.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: followedArtists

### dashboard/analytics.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: AnalyticsOverview

### community-impact/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: CommunityImpactPage

### contact/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: ContactUsPage

### checkout/payment.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### careers/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: CareersPage

### calendars/create.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: accounts, calendars

### booking/manage.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: SectionManager

### booking/calendar.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: CreateSharedCalendar

### billing/subscription.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### billing/payment-methods.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### billing/history.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: ContactPaymentForm

### auth/verify.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### auth/social-login.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

### auth/signup.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

### auth/sign-up.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### auth/sign-in.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### auth/password-security.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### auth/password-reset.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

### auth/password-reset-security.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

### auth/login.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: LoginPage

### auth/forgot-password.tsx
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: ForgotPasswordPage

### auth/confirm.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: ConfirmationStep

### auth/callback.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### auth/callback-error.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### auth/2fa-setup.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: PasswordSecurity

### api/checkin.ts
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: checkins

### api/accounts.ts
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

### advertising-solutions/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: AdvertisingSolutionsPage

### advertise/market-report.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: MarketReportPage

### advertise/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: AdvertisePage

### admin/venue-management.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### admin/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### about/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: AboutPage

### tickets/marketplace/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: TicketMarketplacePage

### tickets/$id/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: TicketDetailPage

### shop/cart/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: ShoppingCartPage

### marketing/docs/layout.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/docs/index.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/docs/$slug.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/contact/index.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/blog/index.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### marketing/blog/$slug.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### dashboard/performer/portfolio.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### dashboard/performer/calendar.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### dashboard/performer/bookings.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### dashboard/organizer/events.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: OrganizerDashboard

### home/user/settings.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### home/user/layout.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### home/user/index-backup.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### home/user/billing.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### home/user/billing-return.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### home/account/settings.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: LikedVenues

### home/account/members.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### home/account/layout.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### home/account/index.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none

### home/account/billing.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### home/account/billing-return.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### checkout/details/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: CheckoutDetailsPage

### checkout/confirmation/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: CheckoutConfirmationPage

### bookings/confirmation/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: BookingConfirmationPage

### events/manage/$id.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### book-it/gigs/create.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: GigCreatorPage

### billing/invoice/$id.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### advertise/packages/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: AdPackagesPage

### advertise/homepage-showcase/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: HomepageShowcasePage

### advertise/event-promotion/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: EventPromotionPage

### advertise/email-campaigns/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: EmailCampaignsPage

### api/billing/customer-portal.ts
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

### api/billing/checkout.ts
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

### admin/accounts/$account.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none

### advertise/featured-listings/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: FeaturedListingsPage

### advertise/contact/index.tsx
- Has loader: ✅
- Has Supabase client: ✅
- Tables queried: none
- Magic Patterns Component: AdvertisingContactPage

### book/performer/$id.tsx
- Has loader: ✅
- Has Supabase client: ❌
- Tables queried: none
- Magic Patterns Component: BookPerformerPage

### home/user/_lib/load-user-workspace.server.ts
- Has loader: ❌
- Has Supabase client: ✅
- Tables queried: none

## Static Pages (no database connection):

### Magic Patterns Static Pages:
- hubs.tsx (Component: null)
- c.$communitySlug.tsx (Component: community)
- book.tsx (Component: BookItPage)
- $.tsx (Component: NotFoundPage)
- performers/tools.tsx (Component: PerformerToolsPage)
- social/notifications.tsx (Component: NotificationsPage)
- social/messages.tsx (Component: MessagesPage)
- layouts/magic-patterns-public.tsx (Component: Header)
- calendars/marketplace.tsx (Component: CalendarMarketplacePage)
- book/performer.tsx (Component: BookPerformerPage)
- book/index.tsx (Component: BookItPage)
- home/account/_components/team-account-layout-page-header.tsx (Component: Header)
- home/account/_components/dashboard-demo.tsx (Component: dashboard)

### Regular Static Pages:
- test.tsx
- test-venues.tsx
- simple-test.tsx
- venues/trending.tsx
- venues/submit.tsx
- venues/management.tsx
- tickets/buy.tsx
- layouts/magic-patterns-dashboard.tsx
- layouts/magic-patterns-auth.tsx
- layouts/magic-patterns-admin.tsx
- layouts/checkout-flow.tsx
- layouts/booking-flow.tsx
- auth/layout.tsx
- admin/layout.tsx
- marketing/_components/site-page-header.tsx
- marketing/_components/site-navigation.tsx
- marketing/_components/site-navigation-item.tsx
- marketing/_components/site-header.tsx
- marketing/_components/site-header-account-section.tsx
- marketing/_components/site-footer.tsx
- api/otp/send.ts
- api/db/webhook.ts
- api/billing/webhook.ts
- admin/_components/mobile-navigation.tsx
- admin/_components/admin-sidebar.tsx
- marketing/docs/_lib/get-docs.ts
- marketing/docs/_components/floating-docs-navigation.tsx
- marketing/docs/_components/docs-page-link.tsx
- marketing/docs/_components/docs-navigation.tsx
- marketing/docs/_components/docs-navigation-collapsible.tsx
- marketing/docs/_components/docs-nav-link.tsx
- marketing/docs/_components/docs-cards.tsx
- marketing/docs/_components/docs-card.tsx
- marketing/contact/_lib/contact-email.schema.ts
- marketing/contact/_components/contact-form.tsx
- marketing/blog/_components/post.tsx
- marketing/blog/_components/post-preview.tsx
- marketing/blog/_components/post-header.tsx
- marketing/blog/_components/draft-post-badge.tsx
- marketing/blog/_components/date-formatter.tsx
- marketing/blog/_components/cover-image.tsx
- marketing/blog/_components/blog-pagination.tsx
- home/user/_lib/load-personal-account-billing.server.ts
- home/user/_components/user-notifications.tsx
- home/user/_components/personal-account-checkout-form.tsx
- home/user/_components/home-sidebar.tsx
- home/user/_components/home-page-header.tsx
- home/user/_components/home-mobile-navigation.tsx
- home/user/_components/home-menu-navigation.tsx
- home/user/_components/home-accounts-list.tsx
- home/user/_components/home-account-selector.tsx
- home/account/_lib/team-account-workspace-loader.server.ts
- home/account/_lib/members-page-loader.ts
- home/account/_lib/load-team-account-billing-page.server.ts
- home/account/_components/team-account-notifications.tsx
- home/account/_components/team-account-navigation-menu.tsx
- home/account/_components/team-account-layout-sidebar.tsx
- home/account/_components/team-account-layout-sidebar-navigation.tsx
- home/account/_components/team-account-layout-mobile-navigation.tsx
- home/account/_components/team-account-checkout-form.tsx
- home/account/_components/team-account-accounts-selector.tsx
- marketing/contact/_lib/server/send-contact-email-action.server.ts

## Database Tables Usage:
- events: 25 queries
- venues: 24 queries
- performers: 10 queries
- bookings: 10 queries
- accounts: 9 queries
- booking_sessions: 7 queries
- hubs: 5 queries
- social_posts: 3 queries
- shared_calendars: 3 queries
- community_hubs: 3 queries
- calendars: 3 queries
- friendships: 2 queries
- liked_venues: 2 queries
- liked_performers: 2 queries
- user_preferences: 2 queries
- event_performers: 2 queries
- products: 2 queries
- hub_members: 2 queries
- event_categories: 1 queries
- live_streams: 1 queries
- tickets: 1 queries
- social_links: 1 queries
- event_comments: 1 queries
- messages: 1 queries
- calendar_shares: 1 queries
- event_reminders: 1 queries
- product_categories: 1 queries
- hub_memberships: 1 queries
- artists: 1 queries
- hub_activities: 1 queries
- hub_gallery: 1 queries
- checkins: 1 queries

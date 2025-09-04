#!/bin/bash
# Auto-generated comprehensive database field fix script
# Generated on: 2025-09-04T02:04:20.305Z
# Confidence level: High (>80%)
# Total fixes: 151

echo "🔧 Starting comprehensive database field fixes..."

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/components/booking/ConfirmationStep.tsx"
sed -i.bak 's/\bcontactEmail\b/contact_email/g' "apps/web/app/components/magic-patterns/components/booking/ConfirmationStep.tsx"
sed -i.bak 's/\bcontactPhone\b/contact_phone/g' "apps/web/app/components/magic-patterns/components/booking/ConfirmationStep.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/components/booking/EventDetailsStep.tsx"
sed -i.bak 's/\bcontactEmail\b/contact_email/g' "apps/web/app/components/magic-patterns/components/booking/EventDetailsStep.tsx"
sed -i.bak 's/\bcontactPhone\b/contact_phone/g' "apps/web/app/components/magic-patterns/components/booking/EventDetailsStep.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/booking/RequirementsStep.tsx"
sed -i.bak 's/\bspecialRequests\b/special_requests/g' "apps/web/app/components/magic-patterns/components/booking/RequirementsStep.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/booking/ReviewStep.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/components/booking/ReviewStep.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/booking-form/SpaceSetupForm.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/components/booking-form/SpaceSetupForm.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/bookings/ActionButtons.tsx"
sed -i.bak 's/\bendDate\b/end_date/g' "apps/web/app/components/magic-patterns/components/bookings/ActionButtons.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/bookings/FinancialBreakdown.tsx"
sed -i.bak 's/\bpaymentStatus\b/payment_status/g' "apps/web/app/components/magic-patterns/components/bookings/FinancialBreakdown.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/bookings/VenueOwnerDashboard.tsx"
sed -i.bak 's/\bpaymentStatus\b/payment_status/g' "apps/web/app/components/magic-patterns/components/bookings/VenueOwnerDashboard.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/check-in/CheckInButton.tsx"
sed -i.bak 's/\beventId\b/event_id/g' "apps/web/app/components/magic-patterns/components/check-in/CheckInButton.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/components/check-in/CheckInFeed.tsx"
sed -i.bak 's/\bvenueId\b/venue_id/g' "apps/web/app/components/magic-patterns/components/check-in/CheckInFeed.tsx"
sed -i.bak 's/\bisActive\b/is_active/g' "apps/web/app/components/magic-patterns/components/check-in/CheckInFeed.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/check-in/CheckInModal.tsx"
sed -i.bak 's/\beventId\b/event_id/g' "apps/web/app/components/magic-patterns/components/check-in/CheckInModal.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/components/check-in/PlannedEventsWidget.tsx"
sed -i.bak 's/\beventId\b/event_id/g' "apps/web/app/components/magic-patterns/components/check-in/PlannedEventsWidget.tsx"
sed -i.bak 's/\bvenueId\b/venue_id/g' "apps/web/app/components/magic-patterns/components/check-in/PlannedEventsWidget.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/hub/analytics/ContentPerformance.tsx"
sed -i.bak 's/\bpublishedAt\b/published_at/g' "apps/web/app/components/magic-patterns/components/hub/analytics/ContentPerformance.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/hub/articles/ArticleCard.tsx"
sed -i.bak 's/\bpublishedAt\b/published_at/g' "apps/web/app/components/magic-patterns/components/hub/articles/ArticleCard.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/hub/articles/ArticleHero.tsx"
sed -i.bak 's/\bpublishedAt\b/published_at/g' "apps/web/app/components/magic-patterns/components/hub/articles/ArticleHero.tsx"

echo "Fixing 3 fields in apps/web/app/components/magic-patterns/components/hub/directory/DirectoryCard.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/components/hub/directory/DirectoryCard.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/components/hub/directory/DirectoryCard.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/components/hub/directory/DirectoryCard.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/hubs/HeroSection.tsx"
sed -i.bak 's/\bmemberCount\b/member_count/g' "apps/web/app/components/magic-patterns/components/hubs/HeroSection.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/hubs/HubCard.tsx"
sed -i.bak 's/\bmemberCount\b/member_count/g' "apps/web/app/components/magic-patterns/components/hubs/HubCard.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/hubs/TrendingTopics.tsx"
sed -i.bak 's/\bmemberCount\b/member_count/g' "apps/web/app/components/magic-patterns/components/hubs/TrendingTopics.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/performers/DiscoverySections.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/components/performers/DiscoverySections.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/performers/PerformerCalendar.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/components/performers/PerformerCalendar.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/performers/PerformerGrid.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/components/performers/PerformerGrid.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/performers/PerformerList.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/components/performers/PerformerList.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/profile/LikedPerformers.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/components/profile/LikedPerformers.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/profile/LikedVenues.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/components/profile/LikedVenues.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/profile/SharedCalendars.tsx"
sed -i.bak 's/\bupdatedAt\b/updated_at/g' "apps/web/app/components/magic-patterns/components/profile/SharedCalendars.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/tickets/TicketPurchaseConfirmation.tsx"
sed -i.bak 's/\bticketType\b/ticket_type/g' "apps/web/app/components/magic-patterns/components/tickets/TicketPurchaseConfirmation.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/venue-detail/PricingSection.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/components/venue-detail/PricingSection.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/venue-marketplace/FilterSidebar.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/components/venue-marketplace/FilterSidebar.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/venue-marketplace/MapView.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/components/venue-marketplace/MapView.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/components/venue-profile/VenueSpaceDetails.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/components/venue-profile/VenueSpaceDetails.tsx"

echo "Fixing 5 fields in apps/web/app/components/magic-patterns/context/CheckInContext.tsx"
sed -i.bak 's/\bisActive\b/is_active/g' "apps/web/app/components/magic-patterns/context/CheckInContext.tsx"
sed -i.bak 's/\beventId\b/event_id/g' "apps/web/app/components/magic-patterns/context/CheckInContext.tsx"
sed -i.bak 's/\bvenueId\b/venue_id/g' "apps/web/app/components/magic-patterns/context/CheckInContext.tsx"
sed -i.bak 's/\bimageUrl\b/image_url/g' "apps/web/app/components/magic-patterns/context/CheckInContext.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/components/magic-patterns/context/CheckInContext.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/EventDetailPage.tsx"
sed -i.bak 's/\bendDate\b/end_date/g' "apps/web/app/components/magic-patterns/pages/EventDetailPage.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/HomePage.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/HomePage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/HomePage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/auth/RegisterPage.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/auth/RegisterPage.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/book/BookPerformerPage.tsx"
sed -i.bak 's/\bmemberCount\b/member_count/g' "apps/web/app/components/magic-patterns/pages/book/BookPerformerPage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/book/BookPerformerPage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/book/BookVenuePage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/book/BookVenuePage.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/book-it/GigCreatorPage.tsx"
sed -i.bak 's/\bcontactEmail\b/contact_email/g' "apps/web/app/components/magic-patterns/pages/book-it/GigCreatorPage.tsx"
sed -i.bak 's/\bcontactPhone\b/contact_phone/g' "apps/web/app/components/magic-patterns/pages/book-it/GigCreatorPage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/book-it/GigsMarketplacePage.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/pages/book-it/GigsMarketplacePage.tsx"

echo "Fixing 3 fields in apps/web/app/components/magic-patterns/pages/book-it/VenueMarketplacePage.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/book-it/VenueMarketplacePage.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/pages/book-it/VenueMarketplacePage.tsx"
sed -i.bak 's/\blistedDate\b/listed_date/g' "apps/web/app/components/magic-patterns/pages/book-it/VenueMarketplacePage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/book-it/venues/BookingRequestPage.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/pages/book-it/venues/BookingRequestPage.tsx"

echo "Fixing 3 fields in apps/web/app/components/magic-patterns/pages/book-it/venues/VenueDetailPage.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/book-it/venues/VenueDetailPage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/book-it/venues/VenueDetailPage.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/pages/book-it/venues/VenueDetailPage.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/bookings/BookingConfirmationPage.tsx"
sed -i.bak 's/\bendDate\b/end_date/g' "apps/web/app/components/magic-patterns/pages/bookings/BookingConfirmationPage.tsx"
sed -i.bak 's/\bspecialRequests\b/special_requests/g' "apps/web/app/components/magic-patterns/pages/bookings/BookingConfirmationPage.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/hub/[slug]/articles.tsx"
sed -i.bak 's/\bisFeatured\b/is_featured/g' "apps/web/app/components/magic-patterns/pages/hub/[slug]/articles.tsx"
sed -i.bak 's/\bpublishedAt\b/published_at/g' "apps/web/app/components/magic-patterns/pages/hub/[slug]/articles.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/hub/[slug]/community.tsx"
sed -i.bak 's/\bcreatedAt\b/created_at/g' "apps/web/app/components/magic-patterns/pages/hub/[slug]/community.tsx"
sed -i.bak 's/\bmemberCount\b/member_count/g' "apps/web/app/components/magic-patterns/pages/hub/[slug]/community.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/hub/[slug]/venues.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/hub/[slug]/venues.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/pages/hub/[slug]/venues.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/my/FanDashboardPage.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/pages/my/FanDashboardPage.tsx"

echo "Fixing 4 fields in apps/web/app/components/magic-patterns/pages/my/venues.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/my/venues.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/my/venues.tsx"
sed -i.bak 's/\bvenueId\b/venue_id/g' "apps/web/app/components/magic-patterns/pages/my/venues.tsx"
sed -i.bak 's/\bisPublic\b/is_public/g' "apps/web/app/components/magic-patterns/pages/my/venues.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/performers/BookPerformerPage.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/pages/performers/BookPerformerPage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/performers/BookPerformerPage.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/performers/PerformerDiscoveryPage.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/pages/performers/PerformerDiscoveryPage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/performers/PerformerDiscoveryPage.tsx"

echo "Fixing 5 fields in apps/web/app/components/magic-patterns/pages/performers/PerformerProfilePage.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/components/magic-patterns/pages/performers/PerformerProfilePage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/performers/PerformerProfilePage.tsx"
sed -i.bak 's/\baverageRating\b/average_rating/g' "apps/web/app/components/magic-patterns/pages/performers/PerformerProfilePage.tsx"
sed -i.bak 's/\bisFeatured\b/is_featured/g' "apps/web/app/components/magic-patterns/pages/performers/PerformerProfilePage.tsx"
sed -i.bak 's/\bcreatedDate\b/created_at/g' "apps/web/app/components/magic-patterns/pages/performers/PerformerProfilePage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/profile/TicketsPage.tsx"
sed -i.bak 's/\bticketType\b/ticket_type/g' "apps/web/app/components/magic-patterns/pages/profile/TicketsPage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/social/SocialFeedPage.tsx"
sed -i.bak 's/\bcreatedAt\b/created_at/g' "apps/web/app/components/magic-patterns/pages/social/SocialFeedPage.tsx"

echo "Fixing 3 fields in apps/web/app/components/magic-patterns/pages/tickets/TicketDetailPage.tsx"
sed -i.bak 's/\bendDate\b/end_date/g' "apps/web/app/components/magic-patterns/pages/tickets/TicketDetailPage.tsx"
sed -i.bak 's/\bticketType\b/ticket_type/g' "apps/web/app/components/magic-patterns/pages/tickets/TicketDetailPage.tsx"
sed -i.bak 's/\bqrCode\b/qr_code/g' "apps/web/app/components/magic-patterns/pages/tickets/TicketDetailPage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/venues/NewVenuesPage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/venues/NewVenuesPage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/venues/SubmitVenuePage.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/venues/SubmitVenuePage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/venues/TrendingVenuesPage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/venues/TrendingVenuesPage.tsx"

echo "Fixing 2 fields in apps/web/app/components/magic-patterns/pages/venues/VenueDetailPage.tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/venues/VenueDetailPage.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/venues/VenueDetailPage.tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/venues/VenueManagementPage.tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/venues/VenueManagementPage.tsx"

echo "Fixing 3 fields in apps/web/app/components/magic-patterns/pages/venues/[venueId]/[venueSlug].tsx"
sed -i.bak 's/\bvenueType\b/venue_type/g' "apps/web/app/components/magic-patterns/pages/venues/[venueId]/[venueSlug].tsx"
sed -i.bak 's/\breviewCount\b/total_reviews/g' "apps/web/app/components/magic-patterns/pages/venues/[venueId]/[venueSlug].tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/pages/venues/[venueId]/[venueSlug].tsx"

echo "Fixing 1 fields in apps/web/app/components/magic-patterns/pages/venues/[venueId]/book.tsx"
sed -i.bak 's/\bpricePerHour\b/price_per_hour/g' "apps/web/app/components/magic-patterns/pages/venues/[venueId]/book.tsx"

echo "Fixing 3 fields in apps/web/app/lib/services/data-service.ts"
sed -i.bak 's/\bcommunityId\b/community_id/g' "apps/web/app/lib/services/data-service.ts"
sed -i.bak 's/\bstartDate\b/start_date/g' "apps/web/app/lib/services/data-service.ts"
sed -i.bak 's/\bendDate\b/end_date/g' "apps/web/app/lib/services/data-service.ts"

echo "Fixing 1 fields in apps/web/app/routes/auth/verify.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/routes/auth/verify.tsx"

echo "Fixing 1 fields in apps/web/app/routes/events.$id.tsx"
sed -i.bak 's/\beventId\b/event_id/g' "apps/web/app/routes/events.$id.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/account/_components/team-account-accounts-selector.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/routes/home/account/_components/team-account-accounts-selector.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/account/_components/team-account-checkout-form.tsx"
sed -i.bak 's/\baccountId\b/account_id/g' "apps/web/app/routes/home/account/_components/team-account-checkout-form.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/account/_components/team-account-layout-mobile-navigation.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/routes/home/account/_components/team-account-layout-mobile-navigation.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/account/_components/team-account-layout-sidebar.tsx"
sed -i.bak 's/\baccountId\b/account_id/g' "apps/web/app/routes/home/account/_components/team-account-layout-sidebar.tsx"

echo "Fixing 2 fields in apps/web/app/routes/home/account/_components/team-account-notifications.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/routes/home/account/_components/team-account-notifications.tsx"
sed -i.bak 's/\baccountId\b/account_id/g' "apps/web/app/routes/home/account/_components/team-account-notifications.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/account/_lib/load-team-account-billing-page.server.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "apps/web/app/routes/home/account/_lib/load-team-account-billing-page.server.ts"

echo "Fixing 1 fields in apps/web/app/routes/home/account/billing.tsx"
sed -i.bak 's/\baccountId\b/account_id/g' "apps/web/app/routes/home/account/billing.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/user/_components/home-account-selector.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/routes/home/user/_components/home-account-selector.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/user/_components/user-notifications.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/routes/home/user/_components/user-notifications.tsx"

echo "Fixing 1 fields in apps/web/app/routes/home/user/_lib/load-personal-account-billing.server.ts"
sed -i.bak 's/\buserId\b/user_id/g' "apps/web/app/routes/home/user/_lib/load-personal-account-billing.server.ts"

echo "Fixing 1 fields in apps/web/app/routes/home/user/index.tsx"
sed -i.bak 's/\bisVerified\b/is_verified/g' "apps/web/app/routes/home/user/index.tsx"

echo "Fixing 1 fields in apps/web/app/routes/marketing/blog/_components/post-header.tsx"
sed -i.bak 's/\bpublishedAt\b/published_at/g' "apps/web/app/routes/marketing/blog/_components/post-header.tsx"

echo "Fixing 1 fields in apps/web/app/routes/marketing/blog/_components/post-preview.tsx"
sed -i.bak 's/\bpublishedAt\b/published_at/g' "apps/web/app/routes/marketing/blog/_components/post-preview.tsx"

echo "Fixing 1 fields in apps/web/app/routes/performers.$id.tsx"
sed -i.bak 's/\bperformerId\b/performer_id/g' "apps/web/app/routes/performers.$id.tsx"

echo "Fixing 1 fields in packages/billing/lemon-squeezy/src/services/create-lemon-squeezy-checkout.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/billing/lemon-squeezy/src/services/create-lemon-squeezy-checkout.ts"

echo "Fixing 1 fields in packages/billing/lemon-squeezy/src/services/lemon-squeezy-subscription-payload-builder.service.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/billing/lemon-squeezy/src/services/lemon-squeezy-subscription-payload-builder.service.ts"

echo "Fixing 1 fields in packages/billing/stripe/src/services/create-stripe-checkout.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/billing/stripe/src/services/create-stripe-checkout.ts"

echo "Fixing 1 fields in packages/billing/stripe/src/services/stripe-billing-strategy.service.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/billing/stripe/src/services/stripe-billing-strategy.service.ts"

echo "Fixing 1 fields in packages/billing/stripe/src/services/stripe-subscription-payload-builder.service.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/billing/stripe/src/services/stripe-subscription-payload-builder.service.ts"

echo "Fixing 1 fields in packages/features/accounts/src/components/account-selector.tsx"
sed -i.bak 's/\bpictureUrl\b/picture_url/g' "packages/features/accounts/src/components/account-selector.tsx"

echo "Fixing 1 fields in packages/features/accounts/src/components/personal-account-settings/account-settings-container.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/accounts/src/components/personal-account-settings/account-settings-container.tsx"

echo "Fixing 1 fields in packages/features/accounts/src/components/personal-account-settings/mfa/multi-factor-auth-list.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/accounts/src/components/personal-account-settings/mfa/multi-factor-auth-list.tsx"

echo "Fixing 1 fields in packages/features/accounts/src/components/personal-account-settings/mfa/multi-factor-auth-setup-dialog.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/accounts/src/components/personal-account-settings/mfa/multi-factor-auth-setup-dialog.tsx"

echo "Fixing 2 fields in packages/features/accounts/src/components/personal-account-settings/update-account-image-container.tsx"
sed -i.bak 's/\bpictureUrl\b/picture_url/g' "packages/features/accounts/src/components/personal-account-settings/update-account-image-container.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/accounts/src/components/personal-account-settings/update-account-image-container.tsx"

echo "Fixing 1 fields in packages/features/accounts/src/server/services/delete-personal-account.service.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/accounts/src/server/services/delete-personal-account.service.ts"

echo "Fixing 1 fields in packages/features/admin/src/components/admin-ban-user-dialog.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/admin/src/components/admin-ban-user-dialog.tsx"

echo "Fixing 1 fields in packages/features/admin/src/components/admin-delete-account-dialog.tsx"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/admin/src/components/admin-delete-account-dialog.tsx"

echo "Fixing 1 fields in packages/features/admin/src/components/admin-delete-user-dialog.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/admin/src/components/admin-delete-user-dialog.tsx"

echo "Fixing 1 fields in packages/features/admin/src/components/admin-impersonate-user-dialog.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/admin/src/components/admin-impersonate-user-dialog.tsx"

echo "Fixing 1 fields in packages/features/admin/src/components/admin-reactivate-user-dialog.tsx"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/admin/src/components/admin-reactivate-user-dialog.tsx"

echo "Fixing 2 fields in packages/features/admin/src/lib/server/admin-actions.server.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/admin/src/lib/server/admin-actions.server.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/admin/src/lib/server/admin-actions.server.ts"

echo "Fixing 2 fields in packages/features/team-accounts/src/server/actions/delete-team-account-actions.server.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/team-accounts/src/server/actions/delete-team-account-actions.server.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/team-accounts/src/server/actions/delete-team-account-actions.server.ts"

echo "Fixing 1 fields in packages/features/team-accounts/src/server/actions/leave-team-account-actions.server.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/team-accounts/src/server/actions/leave-team-account-actions.server.ts"

echo "Fixing 2 fields in packages/features/team-accounts/src/server/api.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/team-accounts/src/server/api.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/team-accounts/src/server/api.ts"

echo "Fixing 1 fields in packages/features/team-accounts/src/server/services/account-invitations.service.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/team-accounts/src/server/services/account-invitations.service.ts"

echo "Fixing 2 fields in packages/features/team-accounts/src/server/services/account-members.service.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/team-accounts/src/server/services/account-members.service.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/team-accounts/src/server/services/account-members.service.ts"

echo "Fixing 2 fields in packages/features/team-accounts/src/server/services/delete-team-account.service.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/team-accounts/src/server/services/delete-team-account.service.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/team-accounts/src/server/services/delete-team-account.service.ts"

echo "Fixing 2 fields in packages/features/team-accounts/src/server/services/leave-team-account.service.ts"
sed -i.bak 's/\baccountId\b/account_id/g' "packages/features/team-accounts/src/server/services/leave-team-account.service.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/features/team-accounts/src/server/services/leave-team-account.service.ts"

echo "Fixing 1 fields in packages/monitoring/baselime/src/services/baselime-server-monitoring.service.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/monitoring/baselime/src/services/baselime-server-monitoring.service.ts"

echo "Fixing 1 fields in packages/otp/src/server/otp.service.server.ts"
sed -i.bak 's/\buserId\b/user_id/g' "packages/otp/src/server/otp.service.server.ts"

echo "Fixing 1 fields in packages/ui/src/makerkit/profile-avatar.tsx"
sed -i.bak 's/\bpictureUrl\b/picture_url/g' "packages/ui/src/makerkit/profile-avatar.tsx"

echo "Fixing 1 fields in packages/ui/src/shadcn/input-otp.tsx"
sed -i.bak 's/\bisActive\b/is_active/g' "packages/ui/src/shadcn/input-otp.tsx"

echo "✅ All fixes applied!"
echo "📋 Backup files created with .bak extension"
echo "🔍 Re-run scanner to verify fixes"

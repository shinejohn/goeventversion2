import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/**
 * Page: Main App Container
 * Type: CSR
 * Mockdata: OFF
 * Description: Main application container that renders all pages and global components
 * Components: Header, Footer
 */
import { MainHeader } from './components/layout/MainHeader';
import { Footer } from './components/layout/Footer';
import { LoginPage } from './pages/LoginPage';
import { CalendarPage } from './pages/CalendarPage';
import { PageDirectory } from './pages/PageDirectory';
import { EventDetailPage } from './pages/EventDetailPage';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { VenuesPage } from './pages/VenuesPage';
import { PerformersPage } from './pages/PerformersPage';
import { TicketsPage } from './pages/TicketsPage';
import { BookItPage } from './pages/BookItPage';
import { GearPage } from './pages/GearPage';
import { AdvertisePage } from './pages/AdvertisePage';
import { AdPackagesPage } from './pages/advertise/AdPackagesPage';
import { EventPromotionPage } from './pages/advertise/EventPromotionPage';
import { FeaturedListingsPage } from './pages/advertise/FeaturedListingsPage';
import { HomepageShowcasePage } from './pages/advertise/HomepageShowcasePage';
import { EmailCampaignsPage } from './pages/advertise/EmailCampaignsPage';
import { AdvertisingContactPage } from './pages/advertise/AdvertisingContactPage';
import { FloatingNav } from './components/navigation/FloatingNav';
import { QuickPageAccess } from './components/navigation/QuickPageAccess';
import { NavigationProvider } from './context/NavigationContext';
import { VenueMarketplacePage } from './pages/book-it/VenueMarketplacePage';
import { VenueDetailPage } from './pages/venues/VenueDetailPage';
import { BookingRequestPage } from './pages/book-it/venues/BookingRequestPage';
import { BookingConfirmationPage } from './pages/bookings/BookingConfirmationPage';
import { PerformerDiscoveryPage } from './pages/performers/PerformerDiscoveryPage';
import { PerformerProfilePage } from './pages/performers/PerformerProfilePage';
import { FanDashboardPage } from './pages/my/FanDashboardPage';
import MyVenuesPage from './pages/my/venues';
import { CheckoutDetailsPage } from './pages/checkout/CheckoutDetailsPage';
import { CheckoutPaymentPage } from './pages/checkout/CheckoutPaymentPage';
import { CheckoutConfirmationPage } from './pages/checkout/CheckoutConfirmationPage';
import { TicketsPage as ProfileTicketsPage } from './pages/profile/TicketsPage';
import { TicketDetailPage } from './pages/tickets/TicketDetailPage';
import { SubmitVenuePage } from './pages/venues/SubmitVenuePage';
import { VenueManagementPage } from './pages/venues/VenueManagementPage';
import { TrendingVenuesPage } from './pages/venues/TrendingVenuesPage';
import { NewVenuesPage } from './pages/venues/NewVenuesPage';
import VenueBookingPage from './pages/venues/[venueId]/book';
import { UserProfilePage } from './pages/profile/UserProfilePage';
import { UserProfileSettingsPage } from './pages/profile/UserProfileSettingsPage';
import { TicketSelectionPage } from './pages/tickets/TicketSelectionPage';
import { CalendarMarketplacePage } from './pages/calendars/CalendarMarketplacePage';
import CreateCalendarPage from './pages/calendars/create';
import EditCalendarPage from './pages/calendar/[id]/edit';
import CalendarDetailPage from './pages/calendar/[slug]';
import HubsDiscoveryPage from './pages/hubs/index';
import { CalendarDashboardPage } from './pages/dashboard/calendars';
import { HubArticlesPage } from './pages/hub/[slug]/articles';
import { HubEventsPage } from './pages/hub/[slug]/events';
import HubAnalyticsPage from './pages/hub/[slug]/analytics';
import HubCommunityPage from './pages/hub/[slug]/community';
import HubPerformersPage from './pages/hub/[slug]/performers';
import { PartnerWithUsPage } from './pages/PartnerWithUsPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GigCreatorPage } from './pages/book-it/GigCreatorPage';
import { GigsMarketplacePage } from './pages/book-it/GigsMarketplacePage';
import { MarketReportPage } from './pages/performers/MarketReportPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CommunityImpactPage } from './pages/CommunityImpactPage';
import { PressMediaPage } from './pages/PressMediaPage';
import { CareersPage } from './pages/CareersPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { ListYourVenuePage } from './pages/ListYourVenuePage';
import { PerformerToolsPage } from './pages/PerformerToolsPage';
import { EventOrganizerHubPage } from './pages/EventOrganizerHubPage';
import { AdvertisingSolutionsPage } from './pages/AdvertisingSolutionsPage';
import { BookingMarketplacePage } from './pages/BookingMarketplacePage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { SunsetMusicFestivalPage } from './pages/success-stories/SunsetMusicFestivalPage';
import { UrbanLoftPage } from './pages/success-stories/UrbanLoftPage';
import { JazzQuartetPage } from './pages/success-stories/JazzQuartetPage';
import { GigMarketplacePage } from './pages/book-it/GigMarketplacePage';
import { PerformerOnboardingPage } from './pages/performers/PerformerOnboardingPage';
import { MarginEventAds } from './components/ads/MarginEventAds';
import { TicketPurchasePage } from './pages/tickets/TicketPurchasePage';
import { TicketMarketplacePage } from './pages/tickets/TicketMarketplacePage';
import SocialFeedPage from './pages/social/SocialFeedPage';
import FriendsPage from './pages/social/FriendsPage';
import GroupsPage from './pages/social/GroupsPage';
import MessagesPage from './pages/social/MessagesPage';
import NotificationsPage from './pages/social/NotificationsPage';
import { CheckInProvider } from './context/CheckInContext';
import { PerformerManagementPage } from './pages/performers/PerformerManagementPage';
export const App = () => {
  return <Router>
      <NavigationProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <MainHeader />
          <main className="flex-grow">
            <Routes>
              {/* Hub Pages */}
              <Route path="/hub/:slug/analytics" element={<HubAnalyticsPage />} />
              <Route path="/hub/:slug/articles" element={<HubArticlesPage />} />
              <Route path="/hub/:slug/events" element={<HubEventsPage />} />
              <Route path="/hub/:slug/community" element={<HubCommunityPage />} />
              <Route path="/hub/:slug/performers" element={<HubPerformersPage />} />
              {/* Calendar Pages */}
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/calendar/:slug" element={<CalendarDetailPage />} />
              <Route path="/calendars/marketplace" element={<CalendarMarketplacePage />} />
              <Route path="/calendars/create" element={<CreateCalendarPage />} />
              <Route path="/calendar/:id/edit" element={<EditCalendarPage />} />
              <Route path="/dashboard/calendars" element={<CalendarDashboardPage />} />
              {/* Footer Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/community-impact" element={<CommunityImpactPage />} />
              <Route path="/press" element={<PressMediaPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
              {/* For Businesses Pages */}
              <Route path="/venues/submit" element={<ListYourVenuePage />} />
              <Route path="/performers/tools" element={<PerformerToolsPage />} />
              <Route path="/organizer-hub" element={<EventOrganizerHubPage />} />
              <Route path="/advertise" element={<AdvertisingSolutionsPage />} />
              <Route path="/book-it/venues" element={<BookingMarketplacePage />} />
              <Route path="/success-stories" element={<SuccessStoriesPage />} />
              {/* Success Stories Detail Pages */}
              <Route path="/success-stories/sunset-music-festival" element={<SunsetMusicFestivalPage />} />
              <Route path="/success-stories/urban-loft" element={<UrbanLoftPage />} />
              <Route path="/success-stories/jazz-quartet" element={<JazzQuartetPage />} />
              {/* Main Pages */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/venues/:id" element={<VenueDetailPage />} />
              <Route path="/performers" element={<PerformersPage />} />
              <Route path="/performers/join" element={<PerformerOnboardingPage />} />
              <Route path="/performers/:id" element={<PerformerProfilePage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/book" element={<BookItPage />} />
              <Route path="/gear" element={<GearPage />} />
              <Route path="/venues/management" element={<VenueManagementPage />} />
              <Route path="/performers/management" element={<PerformerManagementPage />} />
              <Route path="/venues/trending" element={<TrendingVenuesPage />} />
              <Route path="/venues/new" element={<NewVenuesPage />} />
              <Route path="/directory" element={<PageDirectory />} />
              <Route path="/hubs" element={<HubsDiscoveryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile/:username" element={<UserProfilePage />} />
              <Route path="/profile/settings" element={<UserProfileSettingsPage />} />
              <Route path="/profile/tickets" element={<ProfileTicketsPage />} />
              <Route path="/" element={<HomePage />} />
              {/* Advertise Pages */}
              <Route path="/advertise/packages" element={<AdPackagesPage />} />
              <Route path="/advertise/event-promotion" element={<EventPromotionPage />} />
              <Route path="/advertise/featured-listings" element={<FeaturedListingsPage />} />
              <Route path="/advertise/homepage-showcase" element={<HomepageShowcasePage />} />
              <Route path="/advertise/email-campaigns" element={<EmailCampaignsPage />} />
              <Route path="/advertise/contact" element={<AdvertisingContactPage />} />
              {/* Book-It Pages */}
              <Route path="/book-it/create-gig" element={<GigCreatorPage />} />
              <Route path="/book-it/gigs" element={<GigsMarketplacePage />} />
              <Route path="/book-it/gig-marketplace" element={<GigMarketplacePage />} />
              <Route path="/book-it/venues/:id/request" element={<BookingRequestPage />} />
              <Route path="/bookings/confirmed" element={<BookingConfirmationPage />} />
              <Route path="/venues/:venueId/book" element={<VenueBookingPage />} />
              {/* New Performer Pages */}
              <Route path="/performers/market-report" element={<MarketReportPage />} />
              {/* Checkout Pages */}
              <Route path="/checkout/details" element={<CheckoutDetailsPage />} />
              <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />
              <Route path="/checkout/confirmation" element={<CheckoutConfirmationPage />} />
              {/* Ticket Pages */}
              <Route path="/tickets/buy" element={<TicketMarketplacePage />} />
              <Route path="/tickets/:id/select" element={<TicketPurchasePage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              {/* Social Pages */}
              <Route path="/social" element={<SocialFeedPage />} />
              <Route path="/social/friends" element={<FriendsPage />} />
              <Route path="/social/groups" element={<GroupsPage />} />
              <Route path="/social/messages" element={<MessagesPage />} />
              <Route path="/social/notifications" element={<NotificationsPage />} />
              {/* 404 Page - Must be last */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <FloatingNav />
          <QuickPageAccess />
          <MarginEventAds />
        </div>
      </NavigationProvider>
    </Router>;
};
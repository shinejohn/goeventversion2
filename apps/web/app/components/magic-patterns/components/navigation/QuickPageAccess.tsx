import React, { useState } from 'react';
import { ListIcon, XIcon, SearchIcon, HomeIcon, ArrowRightIcon, FilterIcon, FolderIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
type PageInfo = {
  title: string;
  path: string;
  description: string;
  component: string;
  status: 'ready' | 'in-progress' | 'planned';
  category: 'main' | 'auth' | 'settings' | 'book-it' | 'shop' | 'performers' | 'my' | 'admin' | 'venues' | 'events' | 'tickets' | 'advertise';
  icon?: React.ReactNode;
};
export const QuickPageAccess = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  // Get all pages from the PageDirectory
  const allPages: PageInfo[] = [
  // Main Pages
  {
    title: 'Home',
    path: '/',
    description: 'Main home page for events and discovery',
    component: 'HomePage',
    status: 'ready',
    category: 'main'
  }, {
    title: 'Community Calendar',
    path: '/calendar',
    description: 'Primary landing page showing local community events in calendar view',
    component: 'CalendarPage',
    status: 'ready',
    category: 'main'
  }, {
    title: 'Events',
    path: '/events',
    description: 'Browse all events',
    component: 'EventsPage',
    status: 'ready',
    category: 'events'
  }, {
    title: 'Event Details',
    path: '/event',
    description: 'Detailed event information page',
    component: 'EventDetailPage',
    status: 'ready',
    category: 'events'
  }, {
    title: 'Venues',
    path: '/venues',
    description: 'Browse all venues',
    component: 'VenuesPage',
    status: 'ready',
    category: 'venues'
  }, {
    title: 'Trending Venues',
    path: '/venues/trending',
    description: 'Discover popular and trending venues',
    component: 'TrendingVenuesPage',
    status: 'ready',
    category: 'venues'
  }, {
    title: 'New Venues',
    path: '/venues/new',
    description: 'Recently added venues',
    component: 'NewVenuesPage',
    status: 'ready',
    category: 'venues'
  }, {
    title: 'Submit Venue',
    path: '/venues/submit',
    description: 'Form to submit a new venue',
    component: 'SubmitVenuePage',
    status: 'ready',
    category: 'venues'
  }, {
    title: 'Venue Management',
    path: '/venues/management',
    description: 'Dashboard for venue owners to manage their venues',
    component: 'VenueManagementPage',
    status: 'ready',
    category: 'venues'
  },
  // Auth Pages
  {
    title: 'Login',
    path: '/login',
    description: 'Unified login for all user types with role detection',
    component: 'LoginPage',
    status: 'ready',
    category: 'auth'
  }, {
    title: 'Register',
    path: '/register',
    description: 'Create a new account',
    component: 'RegisterPage',
    status: 'ready',
    category: 'auth'
  }, {
    title: 'Forgot Password',
    path: '/auth/forgot-password',
    description: 'Request password reset',
    component: 'ForgotPasswordPage',
    status: 'ready',
    category: 'auth'
  }, {
    title: 'Reset Password',
    path: '/auth/reset-password',
    description: 'Reset password with token',
    component: 'ResetPasswordPage',
    status: 'ready',
    category: 'auth'
  }, {
    title: 'Email Verification',
    path: '/auth/verify-email',
    description: 'Email confirmation landing page',
    component: 'EmailVerificationPage',
    status: 'ready',
    category: 'auth'
  },
  // Performers
  {
    title: 'Performer Discovery',
    path: '/performers',
    description: 'Discover and browse performers',
    component: 'PerformerDiscoveryPage',
    status: 'ready',
    category: 'performers'
  }, {
    title: 'Performer Profile',
    path: '/performers/performer-1',
    description: 'View performer profile details',
    component: 'PerformerProfilePage',
    status: 'ready',
    category: 'performers'
  }, {
    title: 'Performer Registration',
    path: '/performers/register',
    description: 'Register as a performer',
    component: 'PerformerRegistrationPage',
    status: 'ready',
    category: 'performers'
  }, {
    title: 'Performer Dashboard',
    path: '/performers/dashboard',
    description: 'Dashboard for performers to manage their profile and bookings',
    component: 'PerformerDashboardPage',
    status: 'ready',
    category: 'performers'
  }, {
    title: 'Performer Calendar',
    path: '/performers/calendar',
    description: 'Manage performer availability and schedule',
    component: 'PerformerCalendarPage',
    status: 'ready',
    category: 'performers'
  },
  // Book-It Pages
  {
    title: 'Book It',
    path: '/book',
    description: 'Main booking hub for venues and performers',
    component: 'BookItPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Book Venue',
    path: '/book/venue',
    description: 'Find and book venues',
    component: 'BookVenuePage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Book Performer',
    path: '/book/performer',
    description: 'Find and book performers',
    component: 'BookPerformerPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Post a Gig',
    path: '/book/post-gig',
    description: 'Post a gig opportunity for performers',
    component: 'PostGigPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'How It Works',
    path: '/book/how-it-works',
    description: 'Learn about the booking process',
    component: 'BookingHowItWorksPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Start Planning',
    path: '/book/start',
    description: 'Begin the event planning process',
    component: 'StartPlanningPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Venue Marketplace',
    path: '/book-it/venues',
    description: 'Browse venues available for booking',
    component: 'VenueMarketplacePage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Venue Detail',
    path: '/book-it/venues/venue-1',
    description: 'View venue details and availability',
    component: 'VenueDetailPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Booking Request',
    path: '/book-it/venues/venue-1/request',
    description: 'Submit a booking request for a venue',
    component: 'BookingRequestPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Venue Booking Form',
    path: '/venues/venue-1/book',
    description: 'Comprehensive booking form for venue requests',
    component: 'VenueBookingPage',
    status: 'ready',
    category: 'book-it'
  }, {
    title: 'Booking Confirmation',
    path: '/bookings/confirmed',
    description: 'Booking confirmation page',
    component: 'BookingConfirmationPage',
    status: 'ready',
    category: 'book-it'
  },
  // Shop Pages
  {
    title: 'Tickets',
    path: '/tickets',
    description: 'Buy, sell, and manage tickets',
    component: 'TicketsPage',
    status: 'ready',
    category: 'tickets'
  }, {
    title: 'Buy Tickets',
    path: '/tickets/buy',
    description: 'Purchase tickets for events',
    component: 'BuyTicketsPage',
    status: 'ready',
    category: 'tickets'
  }, {
    title: 'Sell Tickets',
    path: '/tickets/sell',
    description: 'Sell your tickets to others',
    component: 'SellTicketsPage',
    status: 'ready',
    category: 'tickets'
  }, {
    title: 'My Tickets',
    path: '/tickets/my-tickets',
    description: 'View and manage your tickets',
    component: 'MyTicketsPage',
    status: 'ready',
    category: 'tickets'
  }, {
    title: 'Gift Tickets',
    path: '/tickets/gift',
    description: 'Gift tickets to friends and family',
    component: 'GiftTicketsPage',
    status: 'ready',
    category: 'tickets'
  }, {
    title: 'Group Tickets',
    path: '/tickets/groups',
    description: 'Purchase tickets for groups',
    component: 'GroupTicketsPage',
    status: 'ready',
    category: 'tickets'
  }, {
    title: 'Shop',
    path: '/shop',
    description: 'Shop for merchandise and gear',
    component: 'GearPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Event Merch',
    path: '/shop/merch',
    description: 'Official merchandise from events',
    component: 'EventMerchPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Artist Goods',
    path: '/shop/artist-goods',
    description: 'Products from local artists',
    component: 'ArtistGoodsPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Vintage Items',
    path: '/shop/vintage',
    description: 'Vintage collectibles and items',
    component: 'VintagePage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Ticket Packages',
    path: '/shop/tickets',
    description: 'Special ticket bundles and packages',
    component: 'TicketPackagesPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Gift Ideas',
    path: '/shop/gifts',
    description: 'Gift ideas for event lovers',
    component: 'GiftIdeasPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Featured Products',
    path: '/shop/featured',
    description: 'Highlighted and featured products',
    component: 'FeaturedProductsPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Product Details',
    path: '/shop/product/product-1',
    description: 'Detailed product information',
    component: 'ProductDetailPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Shopping Cart',
    path: '/shop/cart',
    description: 'View and manage your shopping cart',
    component: 'ShoppingCartPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Checkout',
    path: '/shop/checkout',
    description: 'Complete your purchase',
    component: 'CheckoutPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Order Confirmation',
    path: '/shop/confirmation',
    description: 'Order confirmation details',
    component: 'OrderConfirmationPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Become a Vendor',
    path: '/shop/vendor-signup',
    description: 'Sign up to sell products on the platform',
    component: 'VendorSignupPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Vendor Information',
    path: '/shop/vendor-info',
    description: 'Learn about becoming a vendor',
    component: 'VendorInfoPage',
    status: 'ready',
    category: 'shop'
  },
  // My Pages
  {
    title: 'Fan Dashboard',
    path: '/my/following',
    description: 'View followed artists and upcoming shows',
    component: 'FanDashboardPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Venues',
    path: '/my/venues',
    description: 'Personalized dashboard for tracking favorite venues',
    component: 'MyVenuesPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Venue Lists',
    path: '/my/venues/lists',
    description: 'Create and manage custom venue lists',
    component: 'MyVenueListsPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Reviews',
    path: '/my/reviews',
    description: "Manage reviews you've written for venues and events",
    component: 'MyReviewsPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Photos',
    path: '/my/photos',
    description: "Manage photos you've uploaded for venues and events",
    component: 'MyPhotosPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Rewards',
    path: '/my/rewards',
    description: 'Track loyalty programs and offers from venues',
    component: 'MyRewardsPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Bookings',
    path: '/my/bookings',
    description: 'View and manage your venue bookings',
    component: 'MyBookingsPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Favorites',
    path: '/my/favorites',
    description: 'View your saved favorites',
    component: 'MyFavoritesPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Notifications',
    path: '/my/notifications',
    description: 'Manage your notification preferences',
    component: 'MyNotificationsPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Payment Methods',
    path: '/my/payment-methods',
    description: 'Manage your payment methods',
    component: 'MyPaymentMethodsPage',
    status: 'ready',
    category: 'my'
  }, {
    title: 'My Orders',
    path: '/my/orders',
    description: 'View your order history',
    component: 'MyOrdersPage',
    status: 'ready',
    category: 'my'
  },
  // Advertise Pages
  {
    title: 'Advertise',
    path: '/advertise',
    description: 'Promote your events and venues',
    component: 'AdvertisePage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Event Promotion',
    path: '/advertise/event-promotion',
    description: 'Promote your events to a wider audience',
    component: 'EventPromotionPage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Featured Listings',
    path: '/advertise/featured-listings',
    description: 'Get premium placement for your listings',
    component: 'FeaturedListingsPage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Homepage Showcase',
    path: '/advertise/homepage-showcase',
    description: 'Feature your event or venue on the homepage',
    component: 'HomepageShowcasePage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Email Campaigns',
    path: '/advertise/email-campaigns',
    description: 'Reach users through email marketing',
    component: 'EmailCampaignsPage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Ad Packages',
    path: '/advertise/packages',
    description: 'View advertising package options',
    component: 'AdPackagesPage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Basic Package',
    path: '/advertise/packages/basic',
    description: 'Details about the basic advertising package',
    component: 'BasicPackagePage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Professional Package',
    path: '/advertise/packages/professional',
    description: 'Details about the professional advertising package',
    component: 'ProfessionalPackagePage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Enterprise Package',
    path: '/advertise/packages/enterprise',
    description: 'Details about the enterprise advertising package',
    component: 'EnterprisePackagePage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Audience Targeting',
    path: '/advertise/targeting',
    description: 'Learn about audience targeting options',
    component: 'AudienceTargetingPage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Analytics Dashboard',
    path: '/advertise/analytics',
    description: 'View performance metrics for your ads',
    component: 'AdvertisingAnalyticsPage',
    status: 'ready',
    category: 'advertise'
  }, {
    title: 'Contact Sales',
    path: '/advertise/contact',
    description: 'Get in touch with our advertising team',
    component: 'AdvertisingContactPage',
    status: 'ready',
    category: 'advertise'
  },
  // Settings
  {
    title: 'Account Settings',
    path: '/settings/account',
    description: 'Comprehensive account management',
    component: 'AccountSettingsPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Profile Settings',
    path: '/settings/profile',
    description: 'Update your profile information',
    component: 'ProfileSettingsPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Security Settings',
    path: '/settings/security',
    description: 'Manage account security options',
    component: 'SecuritySettingsPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Notification Settings',
    path: '/settings/notifications',
    description: 'Manage notification preferences',
    component: 'NotificationSettingsPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Privacy Settings',
    path: '/settings/privacy',
    description: 'Control your privacy preferences',
    component: 'PrivacySettingsPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Payment Methods',
    path: '/settings/payment',
    description: 'Manage your payment methods',
    component: 'PaymentSettingsPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Subscription Management',
    path: '/settings/subscription',
    description: 'Manage your subscription plans',
    component: 'SubscriptionSettingsPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Data & Privacy',
    path: '/settings/data',
    description: 'Manage your data and privacy settings',
    component: 'DataPrivacyPage',
    status: 'ready',
    category: 'settings'
  }, {
    title: 'Close Account',
    path: '/settings/close',
    description: 'Close or deactivate your account',
    component: 'CloseAccountPage',
    status: 'ready',
    category: 'settings'
  },
  // Admin Pages
  {
    title: 'Admin Dashboard',
    path: '/admin/dashboard',
    description: 'Main admin control panel',
    component: 'AdminDashboardPage',
    status: 'ready',
    category: 'admin'
  }, {
    title: 'User Management',
    path: '/admin/users',
    description: 'Manage user accounts',
    component: 'UserManagementPage',
    status: 'ready',
    category: 'admin'
  }, {
    title: 'Event Management',
    path: '/admin/events',
    description: 'Manage events on the platform',
    component: 'EventManagementPage',
    status: 'ready',
    category: 'admin'
  }, {
    title: 'Venue Management',
    path: '/admin/venues',
    description: 'Manage venues on the platform',
    component: 'AdminVenueManagementPage',
    status: 'ready',
    category: 'admin'
  }, {
    title: 'Performer Management',
    path: '/admin/performers',
    description: 'Manage performers on the platform',
    component: 'PerformerManagementPage',
    status: 'ready',
    category: 'admin'
  }, {
    title: 'Content Moderation',
    path: '/admin/moderation',
    description: 'Moderate user-generated content',
    component: 'ContentModerationPage',
    status: 'ready',
    category: 'admin'
  }, {
    title: 'Analytics & Reports',
    path: '/admin/analytics',
    description: 'View platform analytics and reports',
    component: 'AdminAnalyticsPage',
    status: 'ready',
    category: 'admin'
  }, {
    title: 'System Settings',
    path: '/admin/settings',
    description: 'Manage platform settings',
    component: 'SystemSettingsPage',
    status: 'ready',
    category: 'admin'
  },
  // Directory Page
  {
    title: 'Page Directory',
    path: '/directory',
    description: 'Browse all pages in the application',
    component: 'PageDirectory',
    status: 'ready',
    category: 'main'
  },
  // Checkout and ticket management pages
  {
    title: 'Checkout Details',
    path: '/checkout/details',
    description: 'Enter checkout details',
    component: 'CheckoutDetailsPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Checkout Payment',
    path: '/checkout/payment',
    description: 'Enter payment information',
    component: 'CheckoutPaymentPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Checkout Confirmation',
    path: '/checkout/confirmation',
    description: 'Confirm your order',
    component: 'CheckoutConfirmationPage',
    status: 'ready',
    category: 'shop'
  }, {
    title: 'Ticket Detail',
    path: '/tickets/ticket-1',
    description: 'View ticket details',
    component: 'TicketDetailPage',
    status: 'ready',
    category: 'tickets'
  }, {
    title: 'Profile Tickets',
    path: '/profile/tickets',
    description: 'View your tickets',
    component: 'ProfileTicketsPage',
    status: 'ready',
    category: 'my'
  }];
  // Define all available categories
  const categories = [{
    id: 'main',
    label: 'Main Pages'
  }, {
    id: 'events',
    label: 'Events'
  }, {
    id: 'venues',
    label: 'Venues'
  }, {
    id: 'performers',
    label: 'Performers'
  }, {
    id: 'book-it',
    label: 'Book It'
  }, {
    id: 'tickets',
    label: 'Tickets'
  }, {
    id: 'shop',
    label: 'Shop'
  }, {
    id: 'my',
    label: 'My Account'
  }, {
    id: 'advertise',
    label: 'Advertise'
  }, {
    id: 'auth',
    label: 'Authentication'
  }, {
    id: 'settings',
    label: 'Settings'
  }, {
    id: 'admin',
    label: 'Admin'
  }];
  // Recently visited pages (would be dynamic in a real app)
  const recentPages = [{
    title: 'Venue Detail',
    path: '/book-it/venues/venue-1'
  }, {
    title: 'Venue Marketplace',
    path: '/book-it/venues'
  }, {
    title: 'Book It',
    path: '/book'
  }, {
    title: 'Home',
    path: '/'
  }];
  // Filter pages based on search term and selected category
  const filteredPages = allPages.filter(page => {
    const matchesSearch = searchTerm ? page.title.toLowerCase().includes(searchTerm.toLowerCase()) || page.path.toLowerCase().includes(searchTerm.toLowerCase()) || page.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = selectedCategory ? page.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  return <div className="fixed bottom-6 left-6 z-50">
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center h-14 w-14 rounded-full shadow-lg focus:outline-none transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-indigo-600'}`} aria-label={isOpen ? 'Close page access' : 'Open page access'}>
        {isOpen ? <XIcon className="h-6 w-6 text-white" /> : <ListIcon className="h-6 w-6 text-white" />}
      </button>
      {/* Page Access Panel */}
      {isOpen && <div className="absolute bottom-16 left-0 mb-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 bg-indigo-600 text-white">
            <h3 className="font-bold text-lg">Complete Page Directory</h3>
            <p className="text-xs text-indigo-100">
              Access ALL pages for comprehensive testing
            </p>
            <div className="mt-2 text-xs bg-indigo-700 text-white py-1 px-2 rounded">
              {filteredPages.length} pages available
            </div>
          </div>
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search all pages..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          {/* Category Filter */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center mb-2">
              <FilterIcon className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Filter by Category
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory(null)} className={`px-2 py-1 text-xs rounded-md ${!selectedCategory ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                All
              </button>
              {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-2 py-1 text-xs rounded-md ${selectedCategory === category.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {category.label}
                </button>)}
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Recent Pages */}
            {!searchTerm && !selectedCategory && <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Recent Pages
                </h4>
                <div className="space-y-1">
                  {recentPages.map((page, index) => <button key={index} onClick={() => handleNavigate(page.path)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${currentPath === page.path ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}>
                      <div className="flex items-center">
                        <span className="flex-1">{page.title}</span>
                        <ArrowRightIcon className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-500">{page.path}</span>
                    </button>)}
                </div>
              </div>}
            {/* All Pages / Search Results / Filtered Results */}
            <div className="p-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {searchTerm ? 'Search Results' : selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.label}` : 'All Pages'}
              </h4>
              {filteredPages.length === 0 ? <div className="py-3 text-center text-sm text-gray-500">
                  No pages match your criteria
                </div> : <div className="space-y-1">
                  {filteredPages.map((page, index) => <button key={index} onClick={() => handleNavigate(page.path)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${currentPath === page.path ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}>
                      <div className="flex items-center">
                        <span className="flex-1">{page.title}</span>
                        <ArrowRightIcon className="h-3 w-3 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {page.path}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {page.category}
                        </span>
                      </div>
                    </button>)}
                </div>}
              {/* Link to full directory */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => handleNavigate('/directory')} className="w-full flex items-center justify-center text-indigo-600 hover:text-indigo-800 text-sm font-medium py-2">
                  Open Full Page Directory
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
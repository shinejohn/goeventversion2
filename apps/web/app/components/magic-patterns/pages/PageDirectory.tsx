import React, { Component } from 'react';
/**
 * Page: Page Directory
 * Type: CSR
 * Mockdata: OFF
 * Description: Site creator page directory for testing and navigation
 * Components: None
 */
import { CalendarIcon, UserIcon, SettingsIcon, MailIcon, HomeIcon, CheckCircleIcon, FolderIcon, TagIcon, FileTextIcon, ArrowRightIcon, MusicIcon, MapPinIcon, TicketIcon, ShoppingBagIcon, BriefcaseIcon, HeartIcon, ListIcon, GiftIcon, MessageSquareIcon, CameraIcon, BuildingIcon, DollarSignIcon, ClockIcon, StarIcon, UsersIcon, PieChartIcon, AlertCircleIcon, BookmarkIcon, BellIcon, CreditCardIcon, LayoutIcon, MegaphoneIcon, BarChartIcon, InfoIcon, HelpCircleIcon, PhoneIcon, SearchIcon, TruckIcon } from 'lucide-react';
import { useNavigationContext } from '../context/NavigationContext';
type PageInfo = {
  title: string;
  path: string;
  description: string;
  component: string;
  status: 'ready' | 'in-progress' | 'planned';
  category: 'main' | 'auth' | 'settings' | 'book-it' | 'shop' | 'performers' | 'my' | 'admin' | 'venues' | 'events' | 'tickets' | 'advertise';
  icon: React.ReactNode;
};
export const PageDirectory = () => {
  const {
    navigateTo,
    currentPath
  } = useNavigationContext();
  // Add implementation status to each page
  const implementationStatus = {
    HomePage: true,
    CalendarPage: true,
    LoginPage: true,
    EventDetailPage: true,
    EventsPage: true,
    VenuesPage: true,
    PerformersPage: true,
    TicketsPage: true,
    BookItPage: true,
    GearPage: true,
    AdvertisePage: true,
    VenueMarketplacePage: true,
    VenueDetailPage: true,
    BookingRequestPage: true,
    BookingConfirmationPage: true,
    PerformerDiscoveryPage: true,
    PerformerProfilePage: true,
    FanDashboardPage: true,
    MyVenuesPage: true,
    CheckoutDetailsPage: true,
    CheckoutPaymentPage: true,
    CheckoutConfirmationPage: true,
    ProfileTicketsPage: true,
    TicketDetailPage: true,
    SubmitVenuePage: true,
    VenueManagementPage: true,
    TrendingVenuesPage: true,
    NewVenuesPage: true,
    VenueBookingPage: true
    // Add other implemented components here
  };
  const getStatusBadge = (status: string, component: string) => {
    const isImplemented = implementationStatus[component as keyof typeof implementationStatus];
    if (!isImplemented) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircleIcon className="h-3 w-3 mr-1" />
          Not Implemented
        </span>;
    }
    switch (status) {
      case 'ready':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Ready
          </span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="h-3 w-3 mr-1 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            In Progress
          </span>;
      case 'planned':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FileTextIcon className="h-3 w-3 mr-1" />
            Planned
          </span>;
      default:
        return null;
    }
  };
  const handleNavigate = (path: string) => {
    navigateTo(path);
  };
  return <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Go Event City - Page Directory
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse and navigate to all available pages in the application
          </p>
        </div>
        <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 bg-gray-50 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Current Path</h2>
            <p className="mt-1 text-sm text-gray-500">
              You are currently viewing:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {currentPath}
              </code>
            </p>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input type="text" placeholder="Search pages..." className="flex-1 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-md p-2" />
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-8">
          {Object.values(categories).map((category, index) => category.pages.length > 0 && <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50">
                    <div className="flex items-center">
                      <FolderIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {category.title}
                      </h3>
                      <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                        {category.pages.length}{' '}
                        {category.pages.length === 1 ? 'page' : 'pages'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {category.pages.map((page, pageIndex) => <button key={pageIndex} onClick={() => handleNavigate(page.path)} className={`block text-left p-4 rounded-lg border transition-all duration-200 ${currentPath === page.path ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${currentPath === page.path ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                            {page.icon}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${currentPath === page.path ? 'text-indigo-700' : 'text-gray-700'}`}>
                                {page.title}
                              </p>
                              <div className="ml-2">
                                {getStatusBadge(page.status, page.component)}
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              {page.path}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          {page.description}
                        </p>
                        <div className="mt-2 flex justify-end">
                          <span className={`inline-flex items-center text-xs font-medium ${currentPath === page.path ? 'text-indigo-600' : 'text-gray-500'}`}>
                            {currentPath === page.path ? 'Current Page' : 'View Page'}
                            <ArrowRightIcon className="ml-1 h-4 w-4" />
                          </span>
                        </div>
                      </button>)}
                  </div>
                </div>)}
        </div>
      </div>
    </div>;
};
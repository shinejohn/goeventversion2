import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { HelpCircleIcon, SearchIcon, BookOpenIcon, MessageSquareIcon, PhoneIcon, MailIcon, FileTextIcon, CheckIcon, ChevronRightIcon, ChevronDownIcon, AlertCircleIcon, InfoIcon, ArrowRightIcon } from 'lucide-react';
const HelpPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  // Mock categories for help topics
  const helpCategories = [{
    id: 'account',
    name: 'Account & Profile',
    icon: <UserIcon />
  }, {
    id: 'tickets',
    name: 'Tickets & Purchases',
    icon: <TicketIcon />
  }, {
    id: 'events',
    name: 'Events & Calendar',
    icon: <CalendarIcon />
  }, {
    id: 'venues',
    name: 'Venues & Bookings',
    icon: <MapPinIcon />
  }, {
    id: 'performers',
    name: 'Artists & Performers',
    icon: <MusicIcon />
  }, {
    id: 'payments',
    name: 'Payments & Billing',
    icon: <DollarSignIcon />
  }, {
    id: 'technical',
    name: 'Technical Support',
    icon: <SettingsIcon />
  }, {
    id: 'safety',
    name: 'Trust & Safety',
    icon: <ShieldIcon />
  }];
  // Mock popular help articles
  const popularArticles = [{
    id: 1,
    title: 'How to transfer tickets to a friend',
    category: 'tickets'
  }, {
    id: 2,
    title: 'Updating your account information',
    category: 'account'
  }, {
    id: 3,
    title: 'Getting a refund for a canceled event',
    category: 'tickets'
  }, {
    id: 4,
    title: 'Adding events to your calendar',
    category: 'events'
  }, {
    id: 5,
    title: 'Troubleshooting login issues',
    category: 'technical'
  }];
  // Mock FAQs
  const faqs = [{
    id: 1,
    question: 'How do I transfer my tickets to someone else?',
    answer: 'You can transfer tickets by navigating to "My Tickets" in your account, selecting the tickets you want to transfer, and clicking the "Transfer" button. You\'ll need to enter the recipient\'s email address, and they\'ll receive instructions on how to claim the tickets.',
    category: 'tickets'
  }, {
    id: 2,
    question: 'What happens if an event is canceled?',
    answer: 'If an event is canceled, you will receive an email notification. In most cases, your tickets will be automatically refunded to your original payment method within 7-10 business days. Some events may offer rescheduling options instead of refunds.',
    category: 'tickets'
  }, {
    id: 3,
    question: 'How do I update my profile information?',
    answer: 'To update your profile, go to "Account Settings" from the dropdown menu under your profile picture. From there, you can edit your personal information, change your password, update notification preferences, and manage your payment methods.',
    category: 'account'
  }, {
    id: 4,
    question: 'Can I sell tickets for my own event?',
    answer: 'Yes! You can create and sell tickets for your own events. Start by clicking "Create Event" in the header, fill in the event details, set up ticket types and pricing, and publish your event. You\'ll be able to track sales and manage attendees from your dashboard.',
    category: 'events'
  }, {
    id: 5,
    question: 'How do I follow artists or venues?',
    answer: 'You can follow artists or venues by visiting their profile page and clicking the "Follow" button. Once followed, you\'ll receive notifications about new events, and they\'ll appear in your "Following" tab on your dashboard.',
    category: 'performers'
  }];
  // Handle FAQ toggle
  const toggleFaq = (faqId: number) => {
    if (expandedFaqs.includes(faqId)) {
      setExpandedFaqs(expandedFaqs.filter(id => id !== faqId));
    } else {
      setExpandedFaqs([...expandedFaqs, faqId]);
    }
  };
  // Filter FAQs based on search query and active category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery ? faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchesCategory = activeCategory ? faq.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              How can we help?
            </h1>
            <p className="mt-3 max-w-md mx-auto text-indigo-200 sm:text-lg">
              Find answers to common questions or contact our support team
            </p>
            <div className="mt-6 max-w-xl mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Search for help articles..." className="block w-full pl-10 pr-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {helpCategories.map(category => <button key={category.id} className={`flex flex-col items-center p-4 rounded-lg border transition-all ${activeCategory === category.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`} onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${activeCategory === category.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                  {category.icon}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-900">
                  {category.name}
                </span>
              </button>)}
          </div>
        </div>
        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Help Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.filter(article => !activeCategory || article.category === activeCategory).map(article => <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/help/articles/${article.id}`)}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <BookOpenIcon className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Read the full article
                        <ChevronRightIcon className="inline-block ml-1 h-4 w-4" />
                      </p>
                    </div>
                  </div>
                </div>)}
          </div>
        </div>
        {/* FAQs */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
            {activeCategory && <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center" onClick={() => setActiveCategory(null)}>
                View All FAQs
              </button>}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {filteredFaqs.length > 0 ? filteredFaqs.map(faq => <div key={faq.id} className="p-6">
                  <button className="flex w-full justify-between items-start text-left" onClick={() => toggleFaq(faq.id)}>
                    <h3 className="text-base font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <span className="ml-6 flex-shrink-0">
                      {expandedFaqs.includes(faq.id) ? <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : <ChevronRightIcon className="h-5 w-5 text-gray-500" />}
                    </span>
                  </button>
                  {expandedFaqs.includes(faq.id) && <div className="mt-4 text-sm text-gray-600">
                      <p>{faq.answer}</p>
                    </div>}
                </div>) : <div className="p-6 text-center">
                <AlertCircleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="text-base font-medium text-gray-900">
                  No FAQs found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or browse different categories
                </p>
              </div>}
          </div>
        </div>
        {/* Contact Options */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Still Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <MessageSquareIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Live Chat
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Chat with our support team in real-time for immediate assistance
              </p>
              <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700" onClick={() => alert('Chat feature would open here')}>
                Start Chat
              </button>
              <p className="mt-2 text-xs text-gray-500">Available 24/7</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <PhoneIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Call Us
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Speak directly with a customer support representative
              </p>
              <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700" onClick={() => window.location.href = 'tel:+18005551234'}>
                Call Support
              </button>
              <p className="mt-2 text-xs text-gray-500">Mon-Fri, 9am-5pm EST</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <MailIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Email Support
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Send us a message and we'll get back to you within 24 hours
              </p>
              <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = 'mailto:support@whensthefun.com'}>
                Email Us
              </button>
              <p className="mt-2 text-xs text-gray-500">
                Response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Custom icon components to match the imports
function UserIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>;
}
function TicketIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"></path>
      <path d="M13 5v2"></path>
      <path d="M13 17v2"></path>
      <path d="M13 11v2"></path>
    </svg>;
}
function CalendarIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>;
}
function MapPinIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>;
}
function MusicIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>;
}
function DollarSignIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>;
}
function SettingsIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>;
}
function ShieldIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>;
}
export default HelpPage;
export { HelpPage };
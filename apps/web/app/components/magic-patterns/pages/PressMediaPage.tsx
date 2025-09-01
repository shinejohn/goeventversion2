import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { Download, ExternalLink, Calendar, Mail, FileText, Image, Newspaper, Award } from 'lucide-react';
export const PressMediaPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const pressReleases = [{
    title: "When's The Fun Expands to 15 New Cities",
    date: 'June 15, 2023',
    excerpt: 'Platform continues rapid growth with expansion into major metropolitan areas across the Southeast.',
    link: '/press/releases/expansion-2023'
  }, {
    title: "New 'Book It' Feature Launches for Venue and Performer Booking",
    date: 'April 3, 2023',
    excerpt: 'Integrated booking system connects venues, performers, and event planners in one seamless platform.',
    link: '/press/releases/book-it-launch'
  }, {
    title: "When's The Fun Secures $12M in Series A Funding",
    date: 'January 22, 2023',
    excerpt: 'Investment will accelerate product development and market expansion for the community events platform.',
    link: '/press/releases/series-a-funding'
  }, {
    title: 'Community Calendar Program Donates 500 Premium Calendars to Nonprofits',
    date: 'November 10, 2022',
    excerpt: 'Initiative provides free event management tools to community organizations across the country.',
    link: '/press/releases/calendar-donation-program'
  }];
  const mediaFeatures = [{
    outlet: 'TechCrunch',
    title: "How When's The Fun is Reimagining Local Event Discovery",
    date: 'May 2023',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    link: 'https://techcrunch.com'
  }, {
    outlet: 'Forbes',
    title: '25 Startups Transforming Community Engagement in 2023',
    date: 'March 2023',
    image: 'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    link: 'https://forbes.com'
  }, {
    outlet: 'Fast Company',
    title: "Innovation by Design Awards: When's The Fun Recognized for UX Excellence",
    date: 'February 2023',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    link: 'https://fastcompany.com'
  }];
  const awards = [{
    name: 'Best Event Discovery Platform',
    organization: 'Tech & Events Awards',
    year: '2023',
    icon: <Award className="h-8 w-8 text-yellow-500" />
  }, {
    name: 'Community Impact Award',
    organization: 'Local Business Association',
    year: '2023',
    icon: <Award className="h-8 w-8 text-yellow-500" />
  }, {
    name: 'App of the Year Finalist',
    organization: 'Mobile Innovation Awards',
    year: '2022',
    icon: <Award className="h-8 w-8 text-yellow-500" />
  }, {
    name: 'Best User Experience',
    organization: 'Digital Design Excellence',
    year: '2022',
    icon: <Award className="h-8 w-8 text-yellow-500" />
  }];
  const resources = [{
    title: 'Company Fact Sheet',
    description: "Key information about When's The Fun, our mission, and our impact.",
    icon: <FileText className="h-6 w-6 text-indigo-600" />,
    downloadLink: '/press/downloads/company-fact-sheet.pdf'
  }, {
    title: 'Brand Assets',
    description: 'Logos, icons, and brand guidelines for media use.',
    icon: <Image className="h-6 w-6 text-indigo-600" />,
    downloadLink: '/press/downloads/brand-assets.zip'
  }, {
    title: 'Executive Bios',
    description: 'Biographies and headshots of our leadership team.',
    icon: <FileText className="h-6 w-6 text-indigo-600" />,
    downloadLink: '/press/downloads/executive-bios.pdf'
  }, {
    title: 'Impact Report 2023',
    description: 'Data and stories about our community impact initiatives.',
    icon: <FileText className="h-6 w-6 text-indigo-600" />,
    downloadLink: '/press/downloads/impact-report-2023.pdf'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              News, resources, and information for journalists and media
              professionals
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigateTo('/press/kit')} className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center">
                <Download className="h-5 w-5 mr-2" />
                Download Press Kit
              </button>
              <button onClick={() => navigateTo('/contact')} className="px-8 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Media Relations
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Press Releases */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Press Releases</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              The latest news and announcements from When's The Fun
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pressReleases.map((release, index) => <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {release.date}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {release.title}
                </h3>
                <p className="text-gray-600 mb-4">{release.excerpt}</p>
                <button onClick={() => navigateTo(release.link)} className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  Read Full Release
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
              </div>)}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigateTo('/press/releases')} className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center">
              View All Press Releases
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Media Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">In The News</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Recent media coverage and features about When's The Fun
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mediaFeatures.map((feature, index) => <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 relative">
                  <img src={feature.image} alt={feature.outlet} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-indigo-600 mb-1">
                    {feature.outlet}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {feature.date}
                  </div>
                  <a href={feature.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                    Read Article
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Awards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Awards & Recognition
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Honoring our commitment to excellence and innovation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award, index) => <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg text-center">
                <div className="flex justify-center mb-4">{award.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {award.name}
                </h3>
                <p className="text-gray-600">{award.organization}</p>
                <p className="text-gray-500 text-sm">{award.year}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Press Resources */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Media Resources
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Download assets and information for media coverage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg flex items-start">
                <div className="flex-shrink-0 mr-4">{resource.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{resource.description}</p>
                  <a href={resource.downloadLink} className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                    Download
                    <Download className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Media Contact Section */}
      <div className="py-16 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Media Contact</h2>
              <p className="text-xl text-indigo-200 mb-6">
                For press inquiries, interview requests, or additional
                information, please contact our media relations team.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-indigo-300" />
                  <span>press@whensthefun.com</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-3 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(727) 555-0123</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-indigo-300 mt-1" />
                  <span>
                    Response time: We strive to respond to all media inquiries
                    within 24 hours during business days.
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <button onClick={() => navigateTo('/contact')} className="px-6 py-2 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="bg-indigo-800 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                Expert Sources Available
              </h3>
              <p className="text-indigo-200 mb-6">
                Our team is available for expert commentary on topics including:
              </p>
              <ul className="space-y-3 text-indigo-100">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Community engagement and event planning
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Local economic development through events
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Technology trends in the events industry
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Small business and performer support
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Digital community building
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Coverage */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">As Featured In</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {['TechCrunch', 'Forbes', 'Fast Company', 'Wired', 'Inc.', 'Entrepreneur'].map((outlet, index) => <div key={index} className="flex justify-center">
                <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">
                  {outlet}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
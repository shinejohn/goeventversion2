import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
type Hub = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  memberCount: number;
  activityLevel: string;
  location: string;
  categories: string[];
  stats: {
    events: number;
    articles: number;
    discussions: number;
  };
  topContributors: {
    id: string;
    name: string;
    avatar: string;
  }[];
  recentActivity: {
    type: string;
    title: string;
    time: string;
  }[];
  isFeatured: boolean;
  creator: string;
  createdAt: string;
};
type HeroSectionProps = {
  featuredHubs: Hub[];
};
export const HeroSection = ({
  featuredHubs
}: HeroSectionProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Auto-rotate featured hubs
  useEffect(() => {
    if (featuredHubs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % featuredHubs.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredHubs.length]);
  const handlePrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + featuredHubs.length) % featuredHubs.length);
  };
  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % featuredHubs.length);
  };
  if (featuredHubs.length === 0) {
    return <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Deep Dive Into Your Passions
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl">
              Explore immersive topic hubs created by passionate community
              leaders
            </p>
            <div className="mt-10">
              <button onClick={() => navigate('/hubs/create')} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50">
                Create Your Hub
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  const currentHub = featuredHubs[currentIndex];
  return <div className="relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <img src={currentHub.image} alt={currentHub.name} className="h-full w-full object-cover opacity-40 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/90"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
              Featured Hub
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Deep Dive Into Your Passions
            </h1>
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-white">
                {currentHub.name}
              </h2>
              <p className="mt-2 text-xl text-gray-300">{currentHub.tagline}</p>
              <p className="mt-4 text-lg text-gray-400 max-w-xl">
                {currentHub.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {currentHub.categories.map((category, index) => <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>)}
              </div>
              <div className="mt-8 flex space-x-4">
                <button onClick={() => navigate(`/hubs/${currentHub.id}`)} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Explore Hub
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10">
                  Join Community
                </button>
              </div>
            </div>
          </div>
          <div className="mt-10 md:mt-0 bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Hub Highlights
              </h3>
              <div className="flex items-center text-gray-300 text-sm">
                <span className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  High Activity
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {currentHub.memberCount.toLocaleString()}
                  </div>
                  <div className="text-sm">Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {currentHub.stats.events}
                  </div>
                  <div className="text-sm">Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {currentHub.stats.discussions}
                  </div>
                  <div className="text-sm">Discussions</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Top Contributors
                </h4>
                <div className="flex -space-x-2 overflow-hidden">
                  {currentHub.topContributors.map((contributor, index) => <img key={index} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={contributor.avatar} alt={contributor.name} />)}
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white text-xs font-medium">
                    +
                    {currentHub.memberCount - currentHub.topContributors.length}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {currentHub.recentActivity.map((activity, index) => <div key={index} className="flex items-start">
                      <span className={`inline-block h-2 w-2 rounded-full mt-1.5 mr-2 ${activity.type === 'event' ? 'bg-purple-400' : activity.type === 'article' ? 'bg-blue-400' : 'bg-yellow-400'}`}></span>
                      <div>
                        <div className="text-sm text-white">
                          {activity.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {activity.time}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Dots */}
      {featuredHubs.length > 1 && <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredHubs.map((_, index) => <button key={index} className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`} onClick={() => setCurrentIndex(index)} aria-label={`Go to slide ${index + 1}`} />)}
        </div>}
      {/* Previous/Next Buttons */}
      {featuredHubs.length > 1 && <>
          <button className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50" onClick={handlePrevious} aria-label="Previous hub">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50" onClick={handleNext} aria-label="Next hub">
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>}
    </div>;
};
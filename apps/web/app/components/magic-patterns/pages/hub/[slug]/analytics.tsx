import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Footer } from '../../../components/layout/Footer';
import { ArrowLeftIcon, DownloadIcon, CalendarIcon, UsersIcon, TrendingUpIcon, MessageSquareIcon, FileTextIcon, DollarSignIcon, BarChart2Icon, AlertTriangleIcon, ChevronDownIcon, MapPinIcon, GlobeIcon, InfoIcon, ClockIcon, UserIcon } from 'lucide-react';
// Import analytics components
import { OverviewMetrics } from '../../../components/hub/analytics/OverviewMetrics';
import { ContentPerformance } from '../../../components/hub/analytics/ContentPerformance';
import { MemberInsights } from '../../../components/hub/analytics/MemberInsights';
import { RevenueReports } from '../../../components/hub/analytics/RevenueReports';
import { ExportTools } from '../../../components/hub/analytics/ExportTools';
export default function HubAnalyticsPage() {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hubData, setHubData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'members' | 'revenue'>('overview');
  const [comparisonMode, setComparisonMode] = useState(false);
  // Fetch hub data and analytics
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // API call to check authorization would go here
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAuthorized(true);
        // API call to fetch hub data would go here
        await new Promise(resolve => setTimeout(resolve, 500));
        setHubData({
          id: slug,
          name: '',
          image: '',
          memberCount: 0,
          createdAt: '',
          owner: {
            id: '',
            name: '',
            avatar: ''
          },
          isMonetized: false,
          isPremium: false
        });
        // API call to fetch analytics data would go here
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalyticsData({
          overview: {
            dateLabels: [],
            memberGrowth: [],
            activeMembers: [],
            contentPublished: [],
            engagement: [],
            revenue: [],
            totals: {
              members: 0,
              activeMembers: 0,
              contentPublished: 0,
              engagement: 0,
              revenue: 0
            },
            growth: {
              members: 0,
              activeMembers: 0,
              contentPublished: 0,
              engagement: 0,
              revenue: 0
            }
          },
          content: {
            topContent: [],
            contentByType: [],
            engagementByContent: [],
            contentTrends: {
              dateLabels: [],
              articles: [],
              discussions: [],
              events: [],
              media: []
            }
          },
          members: {
            topContributors: [],
            memberGeography: [],
            activityByHour: [],
            referralSources: [],
            memberGrowth: {
              dateLabels: [],
              total: [],
              new: []
            },
            memberRetention: 0,
            memberActivity: {
              daily: 0,
              weekly: 0,
              monthly: 0
            }
          },
          revenue: null
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug, timeRange]);
  // Handle time range change
  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y' | 'all') => {
    setTimeRange(range);
  };
  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
  };
  // If authorization check is still in progress
  if (isAuthorized === null) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  // If user is not authorized
  if (isAuthorized === false) {
    return <Navigate to={`/hub/${slug}`} />;
  }
  return <>
      <div className="min-h-screen bg-gray-50">
        {/* Hub Header */}
        <div className="bg-gray-900 text-white relative" style={{
        backgroundImage: hubData?.image ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hubData.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-4">
              <button onClick={() => navigate(`/hubs/${slug}`)} className="flex items-center text-white/80 hover:text-white">
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Hub
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {isLoading ? 'Loading...' : hubData?.name} - Analytics
                </h1>
                <p className="mt-2 text-white/80 max-w-2xl">
                  Track your hub's performance, engagement, and growth metrics
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <div className="bg-black/30 backdrop-blur-sm rounded-md p-1">
                  <select value={timeRange} onChange={e => handleTimeRangeChange(e.target.value as any)} className="bg-transparent text-white border-none text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer">
                    <option value="7d" className="bg-gray-800 text-white">
                      Last 7 days
                    </option>
                    <option value="30d" className="bg-gray-800 text-white">
                      Last 30 days
                    </option>
                    <option value="90d" className="bg-gray-800 text-white">
                      Last 90 days
                    </option>
                    <option value="1y" className="bg-gray-800 text-white">
                      Last year
                    </option>
                    <option value="all" className="bg-gray-800 text-white">
                      All time
                    </option>
                  </select>
                </div>
                <button onClick={toggleComparisonMode} className={`px-3 py-1.5 text-sm font-medium rounded-md ${comparisonMode ? 'bg-indigo-600 text-white' : 'bg-black/30 backdrop-blur-sm text-white hover:bg-black/40'}`}>
                  {comparisonMode ? 'Disable Comparison' : 'Compare Periods'}
                </button>
                <button onClick={() => {}} className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
                  <DownloadIcon className="h-4 w-4 mr-1.5" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading ? <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div> : <>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Overview
                </button>
                <button onClick={() => setActiveTab('content')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Content Performance
                </button>
                <button onClick={() => setActiveTab('members')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'members' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Member Insights
                </button>
                <button onClick={() => setActiveTab('revenue')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'revenue' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} disabled={!hubData?.isMonetized}>
                  Revenue
                  {!hubData?.isMonetized && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Disabled
                    </span>}
                </button>
              </div>
              {/* Active Tab Content */}
              {activeTab === 'overview' && <OverviewMetrics data={analyticsData.overview} comparisonMode={comparisonMode} timeRange={timeRange} />}
              {activeTab === 'content' && <ContentPerformance data={analyticsData.content} comparisonMode={comparisonMode} timeRange={timeRange} />}
              {activeTab === 'members' && <MemberInsights data={analyticsData.members} comparisonMode={comparisonMode} timeRange={timeRange} />}
              {activeTab === 'revenue' && hubData?.isMonetized && <RevenueReports data={analyticsData.revenue} comparisonMode={comparisonMode} timeRange={timeRange} />}
              {/* Export Tools */}
              <div className="mt-8">
                <ExportTools hubSlug={slug as string} timeRange={timeRange} isPremium={hubData?.isPremium} />
              </div>
            </>}
        </div>
      </div>
      <Footer />
    </>;
}
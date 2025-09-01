import React, { useState, Component } from 'react';
import { BarChart2Icon, FileTextIcon, MessageSquareIcon, CalendarIcon, ImageIcon, ExternalLinkIcon, EyeIcon, ThumbsUpIcon, MessageCircleIcon, TrendingUpIcon, TrendingDownIcon, InfoIcon } from 'lucide-react';
type ContentPerformanceProps = {
  data: any;
  comparisonMode: boolean;
  timeRange: string;
};
export const ContentPerformance: React.FC<ContentPerformanceProps> = ({
  data,
  comparisonMode,
  timeRange
}) => {
  const [activeTab, setActiveTab] = useState<'top' | 'trends' | 'engagement'>('top');
  const [contentFilter, setContentFilter] = useState<string>('all');
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  // Get icon for content type
  const getContentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'article':
        return <FileTextIcon className="h-4 w-4 text-blue-500" />;
      case 'discussion':
        return <MessageSquareIcon className="h-4 w-4 text-purple-500" />;
      case 'event':
        return <CalendarIcon className="h-4 w-4 text-red-500" />;
      case 'media':
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      default:
        return <FileTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Filter content by type
  const filteredContent = contentFilter === 'all' ? data.topContent : data.topContent.filter((item: any) => item.type.toLowerCase() === contentFilter.toLowerCase());
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Content Performance
        </h2>
        <p className="text-sm text-gray-500">
          Analyze your hub's content performance and engagement metrics
        </p>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('top')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'top' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Top Content
        </button>
        <button onClick={() => setActiveTab('trends')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'trends' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Content Trends
        </button>
        <button onClick={() => setActiveTab('engagement')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'engagement' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Engagement Analysis
        </button>
      </div>
      {/* Top Content */}
      {activeTab === 'top' && <div className="space-y-6">
          {/* Content Type Filter */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setContentFilter('all')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${contentFilter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              All Content
            </button>
            <button onClick={() => setContentFilter('article')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${contentFilter === 'article' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <FileTextIcon className="h-4 w-4 inline mr-1.5" />
              Articles
            </button>
            <button onClick={() => setContentFilter('discussion')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${contentFilter === 'discussion' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <MessageSquareIcon className="h-4 w-4 inline mr-1.5" />
              Discussions
            </button>
            <button onClick={() => setContentFilter('event')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${contentFilter === 'event' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <CalendarIcon className="h-4 w-4 inline mr-1.5" />
              Events
            </button>
            <button onClick={() => setContentFilter('media')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${contentFilter === 'media' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <ImageIcon className="h-4 w-4 inline mr-1.5" />
              Media
            </button>
          </div>
          {/* Top Content Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">
                Top Performing Content
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eng. Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContent.map((item: any) => <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                            {item.title}
                          </div>
                          <ExternalLinkIcon className="h-4 w-4 ml-2 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getContentTypeIcon(item.type)}
                          <span className="ml-1.5 text-sm text-gray-900">
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={item.author.avatar} alt={item.author.name} className="h-6 w-6 rounded-full mr-2" />
                          <div className="text-sm text-gray-900">
                            {item.author.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.publishedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <EyeIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {formatNumber(item.views)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <ThumbsUpIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {formatNumber(item.engagement)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium px-2 py-0.5 rounded-full inline-flex items-center ${item.engagementRate > 0.08 ? 'bg-green-100 text-green-800' : item.engagementRate > 0.05 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {(item.engagementRate * 100).toFixed(1)}%
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
          {/* Content by Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Content by Type
              </h3>
              <div className="space-y-4">
                {data.contentByType.map((item: any) => <div key={item.type} className="flex items-center">
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center">
                        {item.type === 'Articles' && <FileTextIcon className="h-4 w-4 mr-1.5 text-blue-500" />}
                        {item.type === 'Discussions' && <MessageSquareIcon className="h-4 w-4 mr-1.5 text-purple-500" />}
                        {item.type === 'Events' && <CalendarIcon className="h-4 w-4 mr-1.5 text-red-500" />}
                        {item.type === 'Media' && <ImageIcon className="h-4 w-4 mr-1.5 text-green-500" />}
                        <span className="text-sm font-medium text-gray-900">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`absolute top-0 left-0 h-full rounded-full ${item.type === 'Articles' ? 'bg-blue-500' : item.type === 'Discussions' ? 'bg-purple-500' : item.type === 'Events' ? 'bg-red-500' : 'bg-green-500'}`} style={{
                    width: `${item.count / Math.max(...data.contentByType.map((i: any) => i.count)) * 100}%`
                  }}></div>
                      </div>
                    </div>
                    <div className="w-16 flex-shrink-0 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {item.count}
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Engagement by Content Type
              </h3>
              <div className="space-y-4">
                {data.engagementByContent.map((item: any) => <div key={item.type} className="flex items-center">
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center">
                        {item.type === 'Articles' && <FileTextIcon className="h-4 w-4 mr-1.5 text-blue-500" />}
                        {item.type === 'Discussions' && <MessageSquareIcon className="h-4 w-4 mr-1.5 text-purple-500" />}
                        {item.type === 'Events' && <CalendarIcon className="h-4 w-4 mr-1.5 text-red-500" />}
                        {item.type === 'Media' && <ImageIcon className="h-4 w-4 mr-1.5 text-green-500" />}
                        <span className="text-sm font-medium text-gray-900">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`absolute top-0 left-0 h-full rounded-full ${item.type === 'Articles' ? 'bg-blue-400' : item.type === 'Discussions' ? 'bg-purple-400' : item.type === 'Events' ? 'bg-red-400' : 'bg-green-400'}`} style={{
                    width: `${item.engagement / Math.max(...data.engagementByContent.map((i: any) => i.engagement)) * 100}%`
                  }}></div>
                      </div>
                    </div>
                    <div className="w-20 flex-shrink-0 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatNumber(item.engagement)}
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>}
      {/* Content Trends */}
      {activeTab === 'trends' && <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Content Publishing Trends
            </h3>
            <div className="h-80">
              <ContentTrendsChart data={data.contentTrends} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Content Growth Analysis
              </h3>
              <div className="space-y-4">
                <ContentGrowthItem type="Articles" icon={<FileTextIcon className="h-4 w-4 text-blue-500" />} data={data.contentTrends.articles} color="blue" />
                <ContentGrowthItem type="Discussions" icon={<MessageSquareIcon className="h-4 w-4 text-purple-500" />} data={data.contentTrends.discussions} color="purple" />
                <ContentGrowthItem type="Events" icon={<CalendarIcon className="h-4 w-4 text-red-500" />} data={data.contentTrends.events} color="red" />
                <ContentGrowthItem type="Media" icon={<ImageIcon className="h-4 w-4 text-green-500" />} data={data.contentTrends.media} color="green" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Content Publishing Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <BarChart2Icon className="h-8 w-8 text-indigo-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Most Active Content Type
                    </div>
                    <div className="text-sm text-gray-500">
                      {(() => {
                    const totals = {
                      articles: data.contentTrends.articles.reduce((a: number, b: number) => a + b, 0),
                      discussions: data.contentTrends.discussions.reduce((a: number, b: number) => a + b, 0),
                      events: data.contentTrends.events.reduce((a: number, b: number) => a + b, 0),
                      media: data.contentTrends.media.reduce((a: number, b: number) => a + b, 0)
                    };
                    const max = Math.max(...Object.values(totals));
                    const type = Object.keys(totals).find(key => totals[key as keyof typeof totals] === max);
                    return type?.charAt(0).toUpperCase() + type?.slice(1);
                  })()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <TrendingUpIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Fastest Growing Content
                    </div>
                    <div className="text-sm text-gray-500">
                      {(() => {
                    const growth = {
                      articles: data.contentTrends.articles[data.contentTrends.articles.length - 1] / (data.contentTrends.articles[0] || 1),
                      discussions: data.contentTrends.discussions[data.contentTrends.discussions.length - 1] / (data.contentTrends.discussions[0] || 1),
                      events: data.contentTrends.events[data.contentTrends.events.length - 1] / (data.contentTrends.events[0] || 1),
                      media: data.contentTrends.media[data.contentTrends.media.length - 1] / (data.contentTrends.media[0] || 1)
                    };
                    const max = Math.max(...Object.values(growth));
                    const type = Object.keys(growth).find(key => growth[key as keyof typeof growth] === max);
                    return type?.charAt(0).toUpperCase() + type?.slice(1);
                  })()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-8 w-8 text-amber-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Peak Publishing Period
                    </div>
                    <div className="text-sm text-gray-500">
                      {(() => {
                    const totals = data.contentTrends.dateLabels.map((_: string, i: number) => data.contentTrends.articles[i] + data.contentTrends.discussions[i] + data.contentTrends.events[i] + data.contentTrends.media[i]);
                    const max = Math.max(...totals);
                    const maxIndex = totals.indexOf(max);
                    return data.contentTrends.dateLabels[maxIndex];
                  })()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <InfoIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Content Diversity Score
                    </div>
                    <div className="text-sm text-gray-500">
                      {(() => {
                    const totals = {
                      articles: data.contentTrends.articles.reduce((a: number, b: number) => a + b, 0),
                      discussions: data.contentTrends.discussions.reduce((a: number, b: number) => a + b, 0),
                      events: data.contentTrends.events.reduce((a: number, b: number) => a + b, 0),
                      media: data.contentTrends.media.reduce((a: number, b: number) => a + b, 0)
                    };
                    const total = Object.values(totals).reduce((a: number, b: number) => a + b, 0);
                    const percentages = Object.values(totals).map(v => v / total);
                    // Calculate diversity score (higher is more diverse)
                    const score = Math.round((1 - percentages.reduce((a: number, b: number) => a + b * b, 0)) * 100);
                    const rating = score > 70 ? 'Excellent' : score > 50 ? 'Good' : score > 30 ? 'Fair' : 'Needs Improvement';
                    return `${rating} (${score}/100)`;
                  })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {/* Engagement Analysis */}
      {activeTab === 'engagement' && <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Engagement Overview
                </h3>
                <EyeIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(data.topContent.reduce((sum: number, item: any) => sum + item.views, 0))}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Total content views
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">Avg. views per content</div>
                  <div className="font-medium text-gray-900">
                    {formatNumber(Math.round(data.topContent.reduce((sum: number, item: any) => sum + item.views, 0) / data.topContent.length))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">Avg. engagement rate</div>
                  <div className="font-medium text-gray-900">
                    {(data.topContent.reduce((sum: number, item: any) => sum + item.engagementRate, 0) / data.topContent.length * 100).toFixed(1)}
                    %
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">Most viewed content type</div>
                  <div className="font-medium text-gray-900">
                    {(() => {
                  const viewsByType: Record<string, number> = {};
                  data.topContent.forEach((item: any) => {
                    viewsByType[item.type] = (viewsByType[item.type] || 0) + item.views;
                  });
                  return Object.entries(viewsByType).sort((a, b) => b[1] - a[1])[0][0];
                })()}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Interaction Metrics
                </h3>
                <MessageCircleIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(data.topContent.reduce((sum: number, item: any) => sum + item.engagement, 0))}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Total interactions
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">Interactions per content</div>
                  <div className="font-medium text-gray-900">
                    {formatNumber(Math.round(data.topContent.reduce((sum: number, item: any) => sum + item.engagement, 0) / data.topContent.length))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">Interactions per view</div>
                  <div className="font-medium text-gray-900">
                    {(data.topContent.reduce((sum: number, item: any) => sum + item.engagement, 0) / data.topContent.reduce((sum: number, item: any) => sum + item.views, 0)).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">
                    Most engaging content type
                  </div>
                  <div className="font-medium text-gray-900">
                    {(() => {
                  const engagementByType: Record<string, {
                    total: number;
                    count: number;
                  }> = {};
                  data.topContent.forEach((item: any) => {
                    if (!engagementByType[item.type]) {
                      engagementByType[item.type] = {
                        total: 0,
                        count: 0
                      };
                    }
                    engagementByType[item.type].total += item.engagementRate;
                    engagementByType[item.type].count += 1;
                  });
                  return Object.entries(engagementByType).map(([type, data]) => ({
                    type,
                    avgRate: data.total / data.count
                  })).sort((a, b) => b.avgRate - a.avgRate)[0].type;
                })()}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Top Performers
                </h3>
                <TrendingUpIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-2">
                    Most Viewed Content
                  </div>
                  {(() => {
                const topViewed = [...data.topContent].sort((a, b) => b.views - a.views)[0];
                return <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {getContentTypeIcon(topViewed.type)}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {topViewed.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            {formatNumber(topViewed.views)} views
                          </div>
                        </div>
                      </div>;
              })()}
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">
                    Most Engaging Content
                  </div>
                  {(() => {
                const topEngaging = [...data.topContent].sort((a, b) => b.engagementRate - a.engagementRate)[0];
                return <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {getContentTypeIcon(topEngaging.type)}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {topEngaging.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                            <MessageCircleIcon className="h-3 w-3 mr-1" />
                            {(topEngaging.engagementRate * 100).toFixed(1)}%
                            engagement rate
                          </div>
                        </div>
                      </div>;
              })()}
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">
                    Top Content Creator
                  </div>
                  {(() => {
                const authorStats: Record<string, {
                  name: string;
                  avatar: string;
                  count: number;
                  views: number;
                }> = {};
                data.topContent.forEach((item: any) => {
                  if (!authorStats[item.author.name]) {
                    authorStats[item.author.name] = {
                      name: item.author.name,
                      avatar: item.author.avatar,
                      count: 0,
                      views: 0
                    };
                  }
                  authorStats[item.author.name].count += 1;
                  authorStats[item.author.name].views += item.views;
                });
                const topAuthor = Object.values(authorStats).sort((a, b) => b.views - a.views)[0];
                return <div className="flex items-center">
                        <img src={topAuthor.avatar} alt={topAuthor.name} className="h-8 w-8 rounded-full mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {topAuthor.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {topAuthor.count} items •{' '}
                            {formatNumber(topAuthor.views)} total views
                          </div>
                        </div>
                      </div>;
              })()}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Engagement Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Content Strategy Insights
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {(() => {
                // Generate insights based on the data
                const insights = [];
                // Check most engaging content type
                const engagementByType: Record<string, {
                  total: number;
                  count: number;
                }> = {};
                data.topContent.forEach((item: any) => {
                  if (!engagementByType[item.type]) {
                    engagementByType[item.type] = {
                      total: 0,
                      count: 0
                    };
                  }
                  engagementByType[item.type].total += item.engagementRate;
                  engagementByType[item.type].count += 1;
                });
                const typeRates = Object.entries(engagementByType).map(([type, data]) => ({
                  type,
                  avgRate: data.total / data.count
                })).sort((a, b) => b.avgRate - a.avgRate);
                insights.push(`${typeRates[0].type}s have the highest engagement rate (${(typeRates[0].avgRate * 100).toFixed(1)}%). Consider creating more of this content type.`);
                // Check content volume trends
                const totals = {
                  articles: data.contentTrends.articles.reduce((a: number, b: number) => a + b, 0),
                  discussions: data.contentTrends.discussions.reduce((a: number, b: number) => a + b, 0),
                  events: data.contentTrends.events.reduce((a: number, b: number) => a + b, 0),
                  media: data.contentTrends.media.reduce((a: number, b: number) => a + b, 0)
                };
                const lowestType = Object.entries(totals).sort((a, b) => a[1] - b[1])[0][0];
                insights.push(`Your hub has relatively few ${lowestType}. Adding more could diversify your content mix.`);
                // Analyze recent engagement trends
                const recentEngagement = data.topContent.filter((item: any) => new Date(item.publishedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).sort((a: any, b: any) => b.engagementRate - a.engagementRate).slice(0, 3);
                if (recentEngagement.length > 0) {
                  const commonType = recentEngagement.map((item: any) => item.type).sort((a: string, b: string) => recentEngagement.filter((i: any) => i.type === b).length - recentEngagement.filter((i: any) => i.type === a).length)[0];
                  insights.push(`Recent ${commonType}s are performing well. This content resonates with your current audience.`);
                }
                return insights.map((insight, index) => <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="h-4 w-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <span className="ml-2">{insight}</span>
                      </li>);
              })()}
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Action Items to Improve Engagement
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    </div>
                    <span className="ml-2">
                      Encourage discussion by asking questions at the end of
                      articles
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    </div>
                    <span className="ml-2">
                      Use more visual content in your discussions and articles
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    </div>
                    <span className="ml-2">
                      Highlight top contributors to encourage more participation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    </div>
                    <span className="ml-2">
                      Create more interactive content like polls and surveys
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    </div>
                    <span className="ml-2">
                      Respond to comments promptly to encourage conversation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
// Content Growth Item Component
type ContentGrowthItemProps = {
  type: string;
  icon: React.ReactNode;
  data: number[];
  color: string;
};
const ContentGrowthItem: React.FC<ContentGrowthItemProps> = ({
  type,
  icon,
  data,
  color
}) => {
  // Calculate growth percentage
  const firstValue = data[0] || 1;
  const lastValue = data[data.length - 1];
  const growthPercent = (lastValue - firstValue) / firstValue * 100;
  return <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-2 rounded-md bg-${color}-100 mr-3`}>{icon}</div>
        <div>
          <div className="text-sm font-medium text-gray-900">{type}</div>
          <div className="text-xs text-gray-500">
            {data.reduce((a, b) => a + b, 0)} total •{' '}
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)} avg.
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className={`text-sm font-medium ${growthPercent > 0 ? 'text-green-600' : growthPercent < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {growthPercent > 0 ? '+' : ''}
          {growthPercent.toFixed(1)}%
        </div>
        {growthPercent > 0 ? <TrendingUpIcon className="h-4 w-4 ml-1 text-green-600" /> : growthPercent < 0 ? <TrendingDownIcon className="h-4 w-4 ml-1 text-red-600" /> : null}
      </div>
    </div>;
};
// Content Trends Chart Component
const ContentTrendsChart: React.FC<{
  data: any;
}> = ({
  data
}) => {
  // Calculate the maximum value for scaling
  const allValues = [...data.articles, ...data.discussions, ...data.events, ...data.media];
  const maxValue = Math.max(...allValues);
  return <div className="w-full h-full">
      {/* Chart container with grid */}
      <div className="relative w-full h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-20 w-10 flex flex-col justify-between text-xs text-gray-500">
          <div>{maxValue}</div>
          <div>{Math.round(maxValue * 0.75)}</div>
          <div>{Math.round(maxValue * 0.5)}</div>
          <div>{Math.round(maxValue * 0.25)}</div>
          <div>0</div>
        </div>
        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-20">
          {/* Background grid */}
          <div className="absolute inset-0 grid grid-rows-4 gap-0">
            <div className="border-b border-gray-200"></div>
            <div className="border-b border-gray-200"></div>
            <div className="border-b border-gray-200"></div>
            <div className="border-b border-gray-200"></div>
          </div>
          {/* Data lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Articles line */}
            <path d={generateLinePath(data.articles, maxValue)} fill="none" stroke="#3b82f6" // blue-500
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Discussions line */}
            <path d={generateLinePath(data.discussions, maxValue)} fill="none" stroke="#8b5cf6" // purple-500
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Events line */}
            <path d={generateLinePath(data.events, maxValue)} fill="none" stroke="#ef4444" // red-500
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Media line */}
            <path d={generateLinePath(data.media, maxValue)} fill="none" stroke="#10b981" // green-500
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* X-axis labels */}
        <div className="absolute left-10 right-0 bottom-0 h-20">
          <div className="relative h-full">
            <div className="absolute inset-x-0 top-0 flex justify-between">
              {data.dateLabels.map((label: string, index: number) => {
              // Only show some labels to avoid overcrowding
              if (data.dateLabels.length <= 12 || index % Math.ceil(data.dateLabels.length / 12) === 0) {
                return <div key={index} className="text-xs text-gray-500 transform -translate-x-1/2" style={{
                  left: `${index / (data.dateLabels.length - 1) * 100}%`
                }}>
                      {label}
                    </div>;
              }
              return null;
            })}
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="absolute bottom-0 left-10 right-0 flex justify-center space-x-6 py-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1.5"></div>
            <span className="text-xs text-gray-600">Articles</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-1.5"></div>
            <span className="text-xs text-gray-600">Discussions</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1.5"></div>
            <span className="text-xs text-gray-600">Events</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1.5"></div>
            <span className="text-xs text-gray-600">Media</span>
          </div>
        </div>
      </div>
    </div>;
};
// Helper function to generate SVG path for line chart
function generateLinePath(values: number[], maxValue: number): string {
  if (!values.length) return '';
  return values.map((value, index) => {
    const x = index / (values.length - 1) * 100;
    const y = 100 - value / maxValue * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
}
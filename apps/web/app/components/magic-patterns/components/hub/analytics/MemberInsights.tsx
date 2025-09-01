import React, { useState, Component } from 'react';
import { UsersIcon, UserPlusIcon, UserCheckIcon, MapPinIcon, GlobeIcon, ClockIcon, LinkIcon, TrendingUpIcon, TrendingDownIcon, UserIcon, ExternalLinkIcon } from 'lucide-react';
type MemberInsightsProps = {
  data: any;
  comparisonMode: boolean;
  timeRange: string;
};
export const MemberInsights: React.FC<MemberInsightsProps> = ({
  data,
  comparisonMode,
  timeRange
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'contributors' | 'geography' | 'activity'>('overview');
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  // Format percentage
  const formatPercent = (num: number) => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
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
  // Render trend indicator
  const renderTrend = (value: number) => {
    if (value > 0) {
      return <div className="flex items-center text-green-600">
          <TrendingUpIcon className="h-4 w-4 mr-1" />
          <span>{formatPercent(value)}</span>
        </div>;
    } else if (value < 0) {
      return <div className="flex items-center text-red-600">
          <TrendingDownIcon className="h-4 w-4 mr-1" />
          <span>{formatPercent(value)}</span>
        </div>;
    } else {
      return <div className="flex items-center text-gray-600">
          <span>0%</span>
        </div>;
    }
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Member Insights
        </h2>
        <p className="text-sm text-gray-500">
          Analyze your hub's member demographics, activity patterns, and top
          contributors
        </p>
      </div>
      {/* View Selector */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveView('overview')} className={`px-4 py-2 text-sm font-medium ${activeView === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Member Overview
        </button>
        <button onClick={() => setActiveView('contributors')} className={`px-4 py-2 text-sm font-medium ${activeView === 'contributors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Top Contributors
        </button>
        <button onClick={() => setActiveView('geography')} className={`px-4 py-2 text-sm font-medium ${activeView === 'geography' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Geographic Distribution
        </button>
        <button onClick={() => setActiveView('activity')} className={`px-4 py-2 text-sm font-medium ${activeView === 'activity' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Activity Patterns
        </button>
      </div>
      {/* Member Overview */}
      {activeView === 'overview' && <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                    <UsersIcon className="h-4 w-4 mr-1.5" />
                    Total Members
                  </div>
                  <div className="text-2xl font-bold">
                    {formatNumber(data.memberGrowth.total[data.memberGrowth.total.length - 1])}
                  </div>
                </div>
                <div className="mt-1">
                  {renderTrend((data.memberGrowth.total[data.memberGrowth.total.length - 1] - data.memberGrowth.total[0]) / data.memberGrowth.total[0] * 100)}
                </div>
              </div>
              <MemberGrowthChart data={data.memberGrowth} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                    <UserPlusIcon className="h-4 w-4 mr-1.5" />
                    New Members
                  </div>
                  <div className="text-2xl font-bold">
                    {formatNumber(data.memberGrowth.new.reduce((a: number, b: number) => a + b, 0))}
                  </div>
                </div>
                <div className="mt-1">
                  {renderTrend((data.memberGrowth.new[data.memberGrowth.new.length - 1] - data.memberGrowth.new[0]) / (data.memberGrowth.new[0] || 1) * 100)}
                </div>
              </div>
              <NewMembersChart data={data.memberGrowth} />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                    <UserCheckIcon className="h-4 w-4 mr-1.5" />
                    Member Retention
                  </div>
                  <div className="text-2xl font-bold">
                    {data.memberRetention.toFixed(1)}%
                  </div>
                </div>
                <div className="mt-1">
                  {renderTrend(data.memberRetention - 70)}{' '}
                  {/* Assuming 70% is baseline */}
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{
                width: `${data.memberRetention}%`
              }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Industry average</div>
                  <div className="font-medium text-gray-900">68.5%</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    Member Activity
                  </div>
                  <div className="text-2xl font-bold">
                    {formatNumber(data.memberActivity.daily)}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      daily
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Daily Active</span>
                    <span>
                      {Math.round(data.memberActivity.daily / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{
                  width: `${data.memberActivity.daily / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100}%`
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Weekly Active</span>
                    <span>
                      {Math.round(data.memberActivity.weekly / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{
                  width: `${data.memberActivity.weekly / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100}%`
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Monthly Active</span>
                    <span>
                      {Math.round(data.memberActivity.monthly / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{
                  width: `${data.memberActivity.monthly / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100}%`
                }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Referral Sources
              </h3>
              <div className="space-y-4">
                {data.referralSources.map((source: any, index: number) => <div key={index} className="flex items-center">
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center">
                        <LinkIcon className="h-4 w-4 mr-1.5 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {source.source}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{
                    width: `${source.count / data.referralSources[0].count * 100}%`
                  }}></div>
                      </div>
                    </div>
                    <div className="w-16 flex-shrink-0 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatNumber(source.count)}
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Member Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                    <UserPlusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber(Math.round(data.memberGrowth.new.reduce((a: number, b: number) => a + b, 0) / data.memberGrowth.dateLabels.length))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg. new members per{' '}
                      {timeRange === '1y' || timeRange === 'all' ? 'month' : 'day'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <UserCheckIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round(data.memberActivity.monthly / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                      %
                    </div>
                    <div className="text-xs text-gray-500">
                      Monthly active member percentage
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <GlobeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {data.memberGeography[0].region}
                    </div>
                    <div className="text-xs text-gray-500">
                      Most common member region
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {(() => {
                    const peakHour = [...data.activityByHour].sort((a, b) => b.activity - a.activity)[0].hour;
                    const ampm = peakHour >= 12 ? 'PM' : 'AM';
                    const hour12 = peakHour % 12 || 12;
                    return `${hour12} ${ampm}`;
                  })()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Peak activity time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {/* Top Contributors */}
      {activeView === 'contributors' && <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Top Contributors</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contributions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Since
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.topContributors.map((contributor: any) => <tr key={contributor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={contributor.avatar} alt={contributor.name} className="h-8 w-8 rounded-full mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contributor.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              @
                              {contributor.name.toLowerCase().replace(/\s+/g, '')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contributor.contributions} items
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(contributor.contributions / 30)} per month
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contributor.engagement} interactions
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(contributor.engagement / contributor.contributions)}{' '}
                          per item
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contributor.memberSince)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          View Profile
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Message
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contribution Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Top 5 contributors create
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {Math.round(data.topContributors.reduce((sum: number, contributor: any) => sum + contributor.contributions, 0) / data.contentTrends?.articles?.reduce((a: number, b: number) => a + b, 0) * 100)}
                    %
                  </div>
                  <div className="text-sm text-gray-500">of all content</div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">
                    Average contributions per member
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {(data.contentTrends?.articles?.reduce((a: number, b: number) => a + b, 0) / data.memberGrowth.total[data.memberGrowth.total.length - 1]).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">items per member</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Member Participation
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="text-gray-500">Active contributors</div>
                    <div className="font-medium text-gray-900">
                      {Math.round(data.memberActivity.weekly * 0.3)}
                      <span className="text-gray-500 font-normal ml-1">
                        (
                        {Math.round(data.memberActivity.weekly * 0.3 / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{
                  width: `${data.memberActivity.weekly * 0.3 / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100}%`
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="text-gray-500">Active commenters</div>
                    <div className="font-medium text-gray-900">
                      {Math.round(data.memberActivity.weekly * 0.6)}
                      <span className="text-gray-500 font-normal ml-1">
                        (
                        {Math.round(data.memberActivity.weekly * 0.6 / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{
                  width: `${data.memberActivity.weekly * 0.6 / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100}%`
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="text-gray-500">Passive readers</div>
                    <div className="font-medium text-gray-900">
                      {Math.round(data.memberActivity.monthly * 0.8)}
                      <span className="text-gray-500 font-normal ml-1">
                        (
                        {Math.round(data.memberActivity.monthly * 0.8 / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{
                  width: `${data.memberActivity.monthly * 0.8 / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100}%`
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="text-gray-500">Inactive members</div>
                    <div className="font-medium text-gray-900">
                      {data.memberGrowth.total[data.memberGrowth.total.length - 1] - data.memberActivity.monthly}
                      <span className="text-gray-500 font-normal ml-1">
                        (
                        {Math.round((data.memberGrowth.total[data.memberGrowth.total.length - 1] - data.memberActivity.monthly) / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{
                  width: `${(data.memberGrowth.total[data.memberGrowth.total.length - 1] - data.memberActivity.monthly) / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100}%`
                }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contributor Growth
              </h3>
              <div className="h-40 mb-4">
                <ContributorGrowthChart data={data.memberGrowth} />
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">
                    New contributors this period
                  </div>
                  <div className="font-medium text-gray-900">
                    {Math.round(data.memberGrowth.new.reduce((a: number, b: number) => a + b, 0) * 0.15)}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">
                    Contributor retention rate
                  </div>
                  <div className="font-medium text-gray-900">
                    {(data.memberRetention + 8).toFixed(1)}%
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">
                    Avg. time to first contribution
                  </div>
                  <div className="font-medium text-gray-900">14 days</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Contributor Engagement Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Recognition Programs
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Highlight top contributors on hub homepage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Create a "Contributor of the Month" feature
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Award special badges for consistent contributors
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Engagement Tactics
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Create contributor-only events and discussions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Offer early access to new features for active contributors
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Send personalized thank you messages for contributions
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Activation Strategies
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Create "first contribution" guides for new members
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Run "contribution challenges" with simple prompts
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Pair new members with experienced contributors
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>}
      {/* Geographic Distribution */}
      {activeView === 'geography' && <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Member Geography
              </h3>
              <div className="h-80 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <GlobeIcon className="h-16 w-16 opacity-20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>Interactive map visualization</p>
                    <p className="text-sm">
                      Geographic distribution of members
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Regional Distribution
              </h3>
              <div className="space-y-4">
                {data.memberGeography.map((region: any, index: number) => <div key={index} className="flex items-center">
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1.5 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {region.region}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{
                    width: `${region.count / data.memberGeography[0].count * 100}%`
                  }}></div>
                      </div>
                    </div>
                    <div className="w-16 flex-shrink-0 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatNumber(region.count)}
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Top Cities
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Members
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Generate mock city data based on regions */}
                    {(() => {
                  const cities = [{
                    city: 'New York',
                    country: 'United States',
                    members: Math.round(data.memberGeography[0].count * 0.2)
                  }, {
                    city: 'London',
                    country: 'United Kingdom',
                    members: Math.round(data.memberGeography[1].count * 0.25)
                  }, {
                    city: 'Toronto',
                    country: 'Canada',
                    members: Math.round(data.memberGeography[0].count * 0.1)
                  }, {
                    city: 'Sydney',
                    country: 'Australia',
                    members: Math.round(data.memberGeography[4].count * 0.3)
                  }, {
                    city: 'Tokyo',
                    country: 'Japan',
                    members: Math.round(data.memberGeography[2].count * 0.15)
                  }, {
                    city: 'Berlin',
                    country: 'Germany',
                    members: Math.round(data.memberGeography[1].count * 0.1)
                  }, {
                    city: 'Paris',
                    country: 'France',
                    members: Math.round(data.memberGeography[1].count * 0.1)
                  }, {
                    city: 'Singapore',
                    country: 'Singapore',
                    members: Math.round(data.memberGeography[2].count * 0.1)
                  }, {
                    city: 'São Paulo',
                    country: 'Brazil',
                    members: Math.round(data.memberGeography[3].count * 0.2)
                  }, {
                    city: 'Cape Town',
                    country: 'South Africa',
                    members: Math.round(data.memberGeography[5].count * 0.2)
                  }].sort((a, b) => b.members - a.members).slice(0, 8);
                  const totalMembers = data.memberGrowth.total[data.memberGrowth.total.length - 1];
                  return cities.map((city, index) => <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {city.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {city.country}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(city.members)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(city.members / totalMembers * 100).toFixed(1)}%
                          </td>
                        </tr>);
                })()}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Geographic Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                    <GlobeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {data.memberGeography[0].region} dominates
                    </div>
                    <div className="text-xs text-gray-500">
                      {(data.memberGeography[0].count / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100).toFixed(1)}
                      % of your members are from{' '}
                      {data.memberGeography[0].region}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <TrendingUpIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Fastest growing region
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.memberGeography[2].region} (+
                      {Math.round(Math.random() * 15 + 20)}% this period)
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Time zone diversity
                    </div>
                    <div className="text-xs text-gray-500">
                      Members span {Math.round(Math.random() * 10 + 10)}{' '}
                      different time zones
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Opportunity regions
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.memberGeography[data.memberGeography.length - 1].region}{' '}
                      has growth potential
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Geographic Strategy Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Content Localization
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Schedule content releases to accommodate different time
                      zones
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Create region-specific content that addresses local
                      interests
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Consider multilingual support for key content
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Regional Growth
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Focus growth efforts on{' '}
                      {data.memberGeography[data.memberGeography.length - 2].region}{' '}
                      to increase diversity
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Partner with regional influencers to expand reach
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Run targeted campaigns in high-potential regions
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Community Building
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Create regional sub-groups or channels within your hub
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Appoint regional moderators to help grow local communities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Organize virtual events that work across multiple time
                      zones
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>}
      {/* Activity Patterns */}
      {activeView === 'activity' && <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activity by Hour of Day
              </h3>
              <div className="h-64">
                <ActivityByHourChart data={data.activityByHour} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activity Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Peak activity time
                    </div>
                    <div className="text-xs text-gray-500">
                      {(() => {
                    const peakHour = [...data.activityByHour].sort((a, b) => b.activity - a.activity)[0].hour;
                    const ampm = peakHour >= 12 ? 'PM' : 'AM';
                    const hour12 = peakHour % 12 || 12;
                    return `${hour12}:00 ${ampm} - ${hour12 + 1}:00 ${ampm}`;
                  })()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <UserCheckIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Daily active users
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(data.memberActivity.daily)} (
                      {Math.round(data.memberActivity.daily / data.memberGrowth.total[data.memberGrowth.total.length - 1] * 100)}
                      % of total)
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Most active day
                    </div>
                    <div className="text-xs text-gray-500">
                      Wednesday (followed by Tuesday)
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-600 mr-3">
                    <TrendingUpIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Activity trend
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.random() > 0.5 ? 'Increasing' : 'Stable'} over the
                      past{' '}
                      {timeRange === '7d' ? 'week' : timeRange === '30d' ? 'month' : '3 months'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activity by Content Type
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center text-gray-700">
                      <FileTextIcon className="h-4 w-4 mr-1.5 text-blue-500" />
                      Articles
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatNumber(Math.round(data.memberActivity.daily * 0.4))}{' '}
                      views/day
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{
                  width: '40%'
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center text-gray-700">
                      <MessageSquareIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                      Discussions
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatNumber(Math.round(data.memberActivity.daily * 0.3))}{' '}
                      views/day
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{
                  width: '30%'
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center text-gray-700">
                      <CalendarIcon className="h-4 w-4 mr-1.5 text-red-500" />
                      Events
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatNumber(Math.round(data.memberActivity.daily * 0.2))}{' '}
                      views/day
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{
                  width: '20%'
                }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center text-gray-700">
                      <ImageIcon className="h-4 w-4 mr-1.5 text-green-500" />
                      Media
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatNumber(Math.round(data.memberActivity.daily * 0.1))}{' '}
                      views/day
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{
                  width: '10%'
                }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Member Session Data
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Average session duration</div>
                  <div className="font-medium text-gray-900">
                    {Math.floor(Math.random() * 4) + 6} minutes
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Pages per session</div>
                  <div className="font-medium text-gray-900">
                    {(Math.random() * 3 + 2).toFixed(1)} pages
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Bounce rate</div>
                  <div className="font-medium text-gray-900">
                    {(Math.random() * 20 + 20).toFixed(1)}%
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">Return frequency</div>
                  <div className="font-medium text-gray-900">
                    {(Math.random() * 3 + 2).toFixed(1)} days
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <div className="text-sm font-medium text-gray-900 mb-3">
                    Device Breakdown
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                      Mobile
                    </div>
                    <div className="flex-grow">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{
                      width: '58%'
                    }}></div>
                      </div>
                    </div>
                    <div className="w-12 flex-shrink-0 text-right text-xs font-medium text-gray-900">
                      58%
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                      Desktop
                    </div>
                    <div className="flex-grow">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{
                      width: '36%'
                    }}></div>
                      </div>
                    </div>
                    <div className="w-12 flex-shrink-0 text-right text-xs font-medium text-gray-900">
                      36%
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 flex-shrink-0 text-xs text-gray-500">
                      Tablet
                    </div>
                    <div className="flex-grow">
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-purple-500 rounded-full" style={{
                      width: '6%'
                    }}></div>
                      </div>
                    </div>
                    <div className="w-12 flex-shrink-0 text-right text-xs font-medium text-gray-900">
                      6%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Engagement Optimization Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Content Timing
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Schedule key content releases during peak hours (
                      {(() => {
                    const peakHour = [...data.activityByHour].sort((a, b) => b.activity - a.activity)[0].hour;
                    const ampm = peakHour >= 12 ? 'PM' : 'AM';
                    const hour12 = peakHour % 12 || 12;
                    return `${hour12} ${ampm}`;
                  })()}
                      )
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Send email digests or notifications during high-engagement
                      periods
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Schedule community events during peak activity days
                      (Tuesdays and Wednesdays)
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Mobile Optimization
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Prioritize mobile experience as 58% of traffic comes from
                      mobile devices
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Optimize content for quick consumption during short mobile
                      sessions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Enable push notifications for important updates and
                      interactions
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Engagement Tactics
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Focus on articles and discussions as they drive most
                      engagement
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Create "daily digest" features to encourage regular visits
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-2">
                      Use engagement prompts during low activity periods to
                      boost participation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
// Member Growth Chart Component
const MemberGrowthChart: React.FC<{
  data: any;
}> = ({
  data
}) => {
  return <div className="mt-4 h-16 relative">
      <svg className="w-full h-full" preserveAspectRatio="none">
        <path d={generateSmoothPath(data.total)} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={generateSmoothPath(data.total)} fill="url(#memberGrowthGradient)" strokeWidth="0" opacity="0.2" />
        <defs>
          <linearGradient id="memberGrowthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>;
};
// New Members Chart Component
const NewMembersChart: React.FC<{
  data: any;
}> = ({
  data
}) => {
  return <div className="mt-4 h-16 relative">
      <svg className="w-full h-full" preserveAspectRatio="none">
        <path d={generateBarPath(data.new)} fill="url(#newMembersGradient)" strokeWidth="0" />
        <defs>
          <linearGradient id="newMembersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>;
};
// Contributor Growth Chart Component
const ContributorGrowthChart: React.FC<{
  data: any;
}> = ({
  data
}) => {
  // Calculate active contributors (15% of total members)
  const activeContributors = data.total.map(val => Math.round(val * 0.15));
  return <div className="w-full h-full">
      <svg className="w-full h-full" preserveAspectRatio="none">
        {/* Total members line */}
        <path d={generateSmoothPath(data.total)} fill="none" stroke="#e0e0e0" strokeWidth="2" strokeDasharray="4,2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Active contributors line */}
        <path d={generateSmoothPath(activeContributors)} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={generateSmoothPath(activeContributors)} fill="url(#contributorGrowthGradient)" strokeWidth="0" opacity="0.2" />
        <defs>
          <linearGradient id="contributorGrowthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <div>Active Contributors</div>
        <div>All Members (reference)</div>
      </div>
    </div>;
};
// Activity By Hour Chart Component
const ActivityByHourChart: React.FC<{
  data: any;
}> = ({
  data
}) => {
  const maxActivity = Math.max(...data.map((d: any) => d.activity));
  return <div className="w-full h-full">
      {/* Chart container with grid */}
      <div className="relative w-full h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-20 w-10 flex flex-col justify-between text-xs text-gray-500">
          <div>High</div>
          <div>Medium</div>
          <div>Low</div>
        </div>
        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-20">
          {/* Background grid */}
          <div className="absolute inset-0 grid grid-rows-3 gap-0">
            <div className="border-b border-gray-200"></div>
            <div className="border-b border-gray-200"></div>
            <div></div>
          </div>
          {/* Bars */}
          <div className="absolute inset-0 flex items-end">
            {data.map((hour: any, index: number) => {
            const height = hour.activity / maxActivity * 100;
            const isPeak = hour.activity > maxActivity * 0.8;
            return <div key={index} className="flex-1 flex flex-col justify-end px-0.5 group relative">
                  <div className={`${isPeak ? 'bg-indigo-600' : 'bg-indigo-400'} hover:bg-indigo-500 transition-colors rounded-t`} style={{
                height: `${height}%`
              }}></div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                    <div className="font-bold">
                      {hour.activity} activity units
                    </div>
                    <div className="text-gray-300">
                      {hour.hour % 12 || 12}:00 {hour.hour >= 12 ? 'PM' : 'AM'}
                    </div>
                  </div>
                </div>;
          })}
          </div>
        </div>
        {/* X-axis labels */}
        <div className="absolute left-10 right-0 bottom-0 h-20">
          <div className="relative h-full">
            <div className="absolute inset-x-0 top-0 flex">
              {data.map((hour: any, index: number) => {
              // Only show every 3 hours to avoid overcrowding
              if (index % 3 === 0) {
                return <div key={index} className="flex-1 text-xs text-gray-500 text-center">
                      {hour.hour % 12 || 12} {hour.hour >= 12 ? 'PM' : 'AM'}
                    </div>;
              }
              return <div key={index} className="flex-1"></div>;
            })}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Helper function to generate smooth path for line chart
function generateSmoothPath(values: number[]): string {
  if (!values.length) return '';
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = index / (values.length - 1) * 100;
    const y = 100 - value / max * 100;
    return [x, y];
  });
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = points[i][0];
    const y1 = points[i][1];
    const x2 = points[i + 1][0];
    const y2 = points[i + 1][1];
    const cpx1 = x1 + (x2 - x1) / 3;
    const cpy1 = y1;
    const cpx2 = x1 + 2 * (x2 - x1) / 3;
    const cpy2 = y2;
    path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
  }
  return path;
}
// Helper function to generate bar chart path
function generateBarPath(values: number[]): string {
  if (!values.length) return '';
  const max = Math.max(...values);
  const barWidth = 100 / values.length;
  let path = '';
  values.forEach((value, index) => {
    const x = index / values.length * 100;
    const height = value / max * 100;
    const y = 100 - height;
    path += `M ${x} 100 L ${x} ${y} L ${x + barWidth} ${y} L ${x + barWidth} 100 Z `;
  });
  return path;
}
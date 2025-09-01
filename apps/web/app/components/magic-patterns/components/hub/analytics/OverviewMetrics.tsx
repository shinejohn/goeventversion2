import React from 'react';
import { TrendingUpIcon, TrendingDownIcon, UsersIcon, UserCheckIcon, FileTextIcon, MessageSquareIcon, DollarSignIcon, InfoIcon } from 'lucide-react';
type OverviewMetricsProps = {
  data: any;
  comparisonMode: boolean;
  timeRange: string;
};
export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  data,
  comparisonMode,
  timeRange
}) => {
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  // Format percentage
  const formatPercent = (num: number) => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
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
  // Simple line chart renderer
  const renderLineChart = (values: number[], color: string) => {
    if (!values || values.length === 0) return null;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    // Create points for SVG polyline
    const points = values.map((value, index) => {
      const x = index / (values.length - 1) * 100;
      const y = 100 - (value - min) / range * 100;
      return `${x},${y}`;
    }).join(' ');
    return <div className="relative h-16 w-full">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>;
  };
  // Calculate period label based on timeRange
  const getPeriodLabel = () => {
    switch (timeRange) {
      case '7d':
        return 'past 7 days';
      case '30d':
        return 'past 30 days';
      case '90d':
        return 'past 90 days';
      case '1y':
        return 'past year';
      case 'all':
        return 'all time';
      default:
        return 'selected period';
    }
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Overview Metrics
        </h2>
        <p className="text-sm text-gray-500">
          Key performance indicators for your hub during the {getPeriodLabel()}
        </p>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                <UsersIcon className="h-4 w-4 mr-1.5" />
                Total Members
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(data.totals.members)}
              </div>
            </div>
            <div className="mt-1">{renderTrend(data.growth.members)}</div>
          </div>
          {renderLineChart(data.memberGrowth, '#4f46e5')}
          <div className="mt-2 text-xs text-gray-500">
            {formatNumber(data.memberGrowth[data.memberGrowth.length - 1] - data.memberGrowth[0])}{' '}
            new members in this period
          </div>
        </div>
        {/* Active Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                <UserCheckIcon className="h-4 w-4 mr-1.5" />
                Active Members
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(data.totals.activeMembers)}
              </div>
            </div>
            <div className="mt-1">{renderTrend(data.growth.activeMembers)}</div>
          </div>
          {renderLineChart(data.activeMembers, '#8b5cf6')}
          <div className="mt-2 text-xs text-gray-500">
            {Math.round(data.totals.activeMembers / data.totals.members * 100)}
            % of total members are active
          </div>
        </div>
        {/* Content Published */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                <FileTextIcon className="h-4 w-4 mr-1.5" />
                Content Published
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(data.totals.contentPublished)}
              </div>
            </div>
            <div className="mt-1">
              {renderTrend(data.growth.contentPublished)}
            </div>
          </div>
          {renderLineChart(data.contentPublished, '#10b981')}
          <div className="mt-2 text-xs text-gray-500">
            {formatNumber(Math.round(data.totals.contentPublished / data.dateLabels.length))}{' '}
            items per{' '}
            {timeRange === '1y' || timeRange === 'all' ? 'month' : 'day'} on
            average
          </div>
        </div>
        {/* Engagement */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                <MessageSquareIcon className="h-4 w-4 mr-1.5" />
                Total Engagement
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(data.totals.engagement)}
              </div>
            </div>
            <div className="mt-1">{renderTrend(data.growth.engagement)}</div>
          </div>
          {renderLineChart(data.engagement, '#f59e0b')}
          <div className="mt-2 text-xs text-gray-500">
            {formatNumber(Math.round(data.totals.engagement / data.totals.members))}{' '}
            interactions per member
          </div>
        </div>
      </div>
      {/* Revenue Card (if applicable) */}
      {data.totals.revenue > 0 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <div className="flex items-center text-gray-700 font-medium mb-1">
                <DollarSignIcon className="h-5 w-5 mr-1.5 text-green-600" />
                <h3 className="text-lg font-bold">Revenue Overview</h3>
              </div>
              <p className="text-sm text-gray-500">
                Total revenue generated during the {getPeriodLabel()}
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center bg-green-50 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="font-bold">
                ${formatNumber(data.totals.revenue)}
              </span>
              <span className="mx-1.5">•</span>
              {renderTrend(data.growth.revenue)}
            </div>
          </div>
          <div className="h-40">
            {renderRevenueChart(data.dateLabels, data.revenue)}
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">
                Avg. Revenue per Day
              </div>
              <div className="font-bold">
                $
                {formatNumber(Math.round(data.totals.revenue / data.dateLabels.length))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">
                Avg. Revenue per Member
              </div>
              <div className="font-bold">
                ${(data.totals.revenue / data.totals.members || 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">
                Projected Monthly
              </div>
              <div className="font-bold">
                $
                {formatNumber(Math.round(data.revenue[data.revenue.length - 1] * 30))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <div className="text-sm text-gray-500 mb-1">Projected Annual</div>
              <div className="font-bold">
                $
                {formatNumber(Math.round(data.revenue[data.revenue.length - 1] * 365))}
              </div>
            </div>
          </div>
        </div>}
      {/* Comparison Section */}
      {comparisonMode && <div className="bg-indigo-50 rounded-lg border border-indigo-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-indigo-900">
                Period Comparison
              </h3>
              <p className="text-sm text-indigo-700">
                Comparing current period with previous period of equal length
              </p>
            </div>
            <div className="bg-white rounded-md p-2 flex items-center text-xs text-gray-500">
              <InfoIcon className="h-4 w-4 mr-1 text-indigo-500" />
              <span>
                Based on{' '}
                {timeRange === '1y' || timeRange === 'all' ? 'monthly' : 'daily'}{' '}
                averages
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ComparisonCard title="Member Growth" icon={<UsersIcon className="h-4 w-4" />} currentValue={data.growth.members} previousValue={data.growth.members * (Math.random() * 0.5 + 0.5)} format="percent" />
            <ComparisonCard title="Active Members" icon={<UserCheckIcon className="h-4 w-4" />} currentValue={data.growth.activeMembers} previousValue={data.growth.activeMembers * (Math.random() * 0.5 + 0.5)} format="percent" />
            <ComparisonCard title="Content Published" icon={<FileTextIcon className="h-4 w-4" />} currentValue={Math.round(data.totals.contentPublished / data.dateLabels.length)} previousValue={Math.round(data.totals.contentPublished / data.dateLabels.length * (Math.random() * 0.5 + 0.5))} format="number" />
            <ComparisonCard title="Engagement" icon={<MessageSquareIcon className="h-4 w-4" />} currentValue={Math.round(data.totals.engagement / data.dateLabels.length)} previousValue={Math.round(data.totals.engagement / data.dateLabels.length * (Math.random() * 0.5 + 0.5))} format="number" />
          </div>
        </div>}
      {/* Metrics Explanations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Metrics Explained
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-700 font-medium mb-1">
                <UsersIcon className="h-4 w-4 mr-1.5 text-indigo-600" />
                Total Members
              </div>
              <p className="text-sm text-gray-500">
                The total number of members who have joined your hub, including
                both active and inactive members.
              </p>
            </div>
            <div>
              <div className="flex items-center text-gray-700 font-medium mb-1">
                <UserCheckIcon className="h-4 w-4 mr-1.5 text-purple-600" />
                Active Members
              </div>
              <p className="text-sm text-gray-500">
                Members who have engaged with your hub content in the last 30
                days through views, likes, comments, or other interactions.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center text-gray-700 font-medium mb-1">
                <FileTextIcon className="h-4 w-4 mr-1.5 text-green-600" />
                Content Published
              </div>
              <p className="text-sm text-gray-500">
                The total number of content items published in your hub,
                including articles, discussions, events, and media.
              </p>
            </div>
            <div>
              <div className="flex items-center text-gray-700 font-medium mb-1">
                <MessageSquareIcon className="h-4 w-4 mr-1.5 text-amber-600" />
                Total Engagement
              </div>
              <p className="text-sm text-gray-500">
                The sum of all interactions with your hub content, including
                views, likes, comments, shares, and event RSVPs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Comparison card component
type ComparisonCardProps = {
  title: string;
  icon: React.ReactNode;
  currentValue: number;
  previousValue: number;
  format: 'number' | 'percent' | 'currency';
};
const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title,
  icon,
  currentValue,
  previousValue,
  format
}) => {
  // Format value based on type
  const formatValue = (value: number) => {
    if (format === 'percent') {
      return `${value.toFixed(1)}%`;
    } else if (format === 'currency') {
      return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    } else {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };
  // Calculate percent change
  const percentChange = (currentValue - previousValue) / previousValue * 100;
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center text-gray-700 text-sm font-medium mb-2">
        <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-700 mr-2">
          {icon}
        </div>
        {title}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">Current</div>
          <div className="text-lg font-bold">{formatValue(currentValue)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">Previous</div>
          <div className="text-sm font-medium">
            {formatValue(previousValue)}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="text-xs text-gray-500">Change</div>
        <div className={`flex items-center text-sm font-medium ${percentChange > 0 ? 'text-green-600' : percentChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {percentChange > 0 ? <TrendingUpIcon className="h-4 w-4 mr-1" /> : percentChange < 0 ? <TrendingDownIcon className="h-4 w-4 mr-1" /> : null}
          {percentChange > 0 ? '+' : ''}
          {percentChange.toFixed(1)}%
        </div>
      </div>
    </div>;
};
// Revenue chart renderer
const renderRevenueChart = (labels: string[], values: number[]) => {
  if (!values || values.length === 0) return null;
  const max = Math.max(...values);
  const min = 0; // Start from zero for revenue
  const range = max - min || 1;
  return <div className="relative h-full w-full">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
        <div>${max}</div>
        <div>${Math.round(max / 2)}</div>
        <div>$0</div>
      </div>
      {/* Chart area */}
      <div className="absolute left-12 right-0 top-0 bottom-0">
        {/* Background grid */}
        <div className="absolute inset-0 grid grid-rows-2 gap-0">
          <div className="border-b border-gray-200"></div>
          <div></div>
        </div>
        {/* Bars */}
        <div className="absolute inset-0 flex items-end">
          {values.map((value, index) => {
          const height = value / max * 100;
          return <div key={index} className="flex-1 flex flex-col justify-end px-0.5 group relative">
                <div className="bg-green-500 hover:bg-green-600 transition-colors rounded-t" style={{
              height: `${height}%`
            }}></div>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                  <div className="font-bold">${value}</div>
                  <div className="text-gray-300">{labels[index]}</div>
                </div>
                {/* X-axis label - only show some labels to avoid overcrowding */}
                {(values.length <= 12 || index % Math.ceil(values.length / 12) === 0) && <div className="text-xs text-gray-500 text-center mt-1 truncate" style={{
              fontSize: '0.65rem'
            }}>
                    {labels[index]}
                  </div>}
              </div>;
        })}
        </div>
      </div>
    </div>;
};
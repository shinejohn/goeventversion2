import React, { useState } from 'react';
import { ChevronDownIcon, TrendingUpIcon, UsersIcon, CalendarIcon, BarChart2Icon, DollarSignIcon } from 'lucide-react';
type AnalyticsData = {
  followerGrowth: number[];
  eventsCurated: number[];
  engagement: number[];
  revenue: number[];
  months: string[];
};
type AnalyticsOverviewProps = {
  data: AnalyticsData;
};
export const AnalyticsOverview = ({
  data
}: AnalyticsOverviewProps) => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('1y');
  const [activeMetric, setActiveMetric] = useState<'followers' | 'events' | 'engagement' | 'revenue'>('followers');
  // Calculate the range based on selected time period
  const getDataRange = () => {
    const fullLength = data.months.length;
    switch (timeRange) {
      case '3m':
        return {
          months: data.months.slice(fullLength - 3, fullLength),
          values: getActiveMetricData().slice(fullLength - 3, fullLength)
        };
      case '6m':
        return {
          months: data.months.slice(fullLength - 6, fullLength),
          values: getActiveMetricData().slice(fullLength - 6, fullLength)
        };
      case '1y':
      default:
        return {
          months: data.months,
          values: getActiveMetricData()
        };
    }
  };
  // Get the data for the active metric
  const getActiveMetricData = () => {
    switch (activeMetric) {
      case 'events':
        return data.eventsCurated;
      case 'engagement':
        return data.engagement;
      case 'revenue':
        return data.revenue;
      case 'followers':
      default:
        return data.followerGrowth;
    }
  };
  // Calculate percent change from first to last value
  const calculateGrowth = (values: number[]) => {
    if (values.length < 2) return 0;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    return firstValue === 0 ? 100 : (lastValue - firstValue) / firstValue * 100;
  };
  const {
    months,
    values
  } = getDataRange();
  const growth = calculateGrowth(values);
  // Find max value for scaling the chart
  const maxValue = Math.max(...values);
  // Simple chart renderer
  const renderChart = () => {
    const barWidth = 100 / values.length;
    return <div className="h-48 mt-4 flex items-end">
        {values.map((value, index) => {
        const height = value / maxValue * 100;
        return <div key={index} className="group relative flex flex-col items-center" style={{
          width: `${barWidth}%`
        }}>
              <div className={`w-full mx-0.5 rounded-t ${activeMetric === 'followers' ? 'bg-indigo-500' : activeMetric === 'events' ? 'bg-purple-500' : activeMetric === 'engagement' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{
            height: `${height}%`
          }}></div>
              <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                {months[index]}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                {activeMetric === 'revenue' ? `$${value}` : activeMetric === 'engagement' ? `${value}%` : value}
              </div>
            </div>;
      })}
      </div>;
  };
  return <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Analytics Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Performance metrics across all your calendars
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <button onClick={() => setTimeRange('3m')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeRange === '3m' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
              3 Months
            </button>
            <button onClick={() => setTimeRange('6m')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeRange === '6m' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
              6 Months
            </button>
            <button onClick={() => setTimeRange('1y')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${timeRange === '1y' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
              1 Year
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {/* Metric Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button onClick={() => setActiveMetric('followers')} className={`flex items-center justify-between p-3 rounded-lg border ${activeMetric === 'followers' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${activeMetric === 'followers' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <UsersIcon className={`h-5 w-5 ${activeMetric === 'followers' ? 'text-indigo-600' : 'text-gray-500'}`} />
              </div>
              <span className={`ml-3 font-medium ${activeMetric === 'followers' ? 'text-indigo-900' : 'text-gray-700'}`}>
                Followers
              </span>
            </div>
            <ChevronDownIcon className={`h-5 w-5 ${activeMetric === 'followers' ? 'text-indigo-600' : 'text-gray-400'}`} />
          </button>
          <button onClick={() => setActiveMetric('events')} className={`flex items-center justify-between p-3 rounded-lg border ${activeMetric === 'events' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${activeMetric === 'events' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                <CalendarIcon className={`h-5 w-5 ${activeMetric === 'events' ? 'text-purple-600' : 'text-gray-500'}`} />
              </div>
              <span className={`ml-3 font-medium ${activeMetric === 'events' ? 'text-purple-900' : 'text-gray-700'}`}>
                Events
              </span>
            </div>
            <ChevronDownIcon className={`h-5 w-5 ${activeMetric === 'events' ? 'text-purple-600' : 'text-gray-400'}`} />
          </button>
          <button onClick={() => setActiveMetric('engagement')} className={`flex items-center justify-between p-3 rounded-lg border ${activeMetric === 'engagement' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${activeMetric === 'engagement' ? 'bg-green-100' : 'bg-gray-100'}`}>
                <BarChart2Icon className={`h-5 w-5 ${activeMetric === 'engagement' ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <span className={`ml-3 font-medium ${activeMetric === 'engagement' ? 'text-green-900' : 'text-gray-700'}`}>
                Engagement
              </span>
            </div>
            <ChevronDownIcon className={`h-5 w-5 ${activeMetric === 'engagement' ? 'text-green-600' : 'text-gray-400'}`} />
          </button>
          <button onClick={() => setActiveMetric('revenue')} className={`flex items-center justify-between p-3 rounded-lg border ${activeMetric === 'revenue' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${activeMetric === 'revenue' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                <DollarSignIcon className={`h-5 w-5 ${activeMetric === 'revenue' ? 'text-yellow-600' : 'text-gray-500'}`} />
              </div>
              <span className={`ml-3 font-medium ${activeMetric === 'revenue' ? 'text-yellow-900' : 'text-gray-700'}`}>
                Revenue
              </span>
            </div>
            <ChevronDownIcon className={`h-5 w-5 ${activeMetric === 'revenue' ? 'text-yellow-600' : 'text-gray-400'}`} />
          </button>
        </div>
        {/* Chart Header */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {activeMetric === 'followers' ? 'Follower Growth' : activeMetric === 'events' ? 'Events Curated' : activeMetric === 'engagement' ? 'Engagement Rate (%)' : 'Revenue ($)'}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold">
                {activeMetric === 'revenue' ? '$' : ''}
                {values[values.length - 1]}
                {activeMetric === 'engagement' ? '%' : ''}
              </span>
              <div className={`ml-2 flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUpIcon className="h-5 w-5 mr-1" />
                <span>{growth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Compared to</div>
            <div className="text-sm font-medium text-gray-900">
              {timeRange === '3m' ? 'Last 3 months' : timeRange === '6m' ? 'Last 6 months' : 'Last year'}
            </div>
          </div>
        </div>
        {/* Chart */}
        {renderChart()}
      </div>
    </div>;
};
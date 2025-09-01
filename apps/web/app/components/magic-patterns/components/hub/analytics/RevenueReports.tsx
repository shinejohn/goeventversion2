import React from 'react';
import { DollarSignIcon, TrendingUpIcon, CalendarIcon, CreditCardIcon, TagIcon, ShoppingCartIcon, UsersIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
type RevenueReportsProps = {
  data: {
    dateLabels: string[];
    total: number[];
    subscriptionRevenue: number[];
    sponsorIncome: number[];
    marketplaceCommissions: number[];
    revenueBreakdown: Array<{
      source: string;
      amount: number;
    }>;
    projections: {
      nextMonth: number;
      nextQuarter: number;
      nextYear: number;
    };
    arpu: string;
  };
  comparisonMode: boolean;
  timeRange: string;
};
export const RevenueReports: React.FC<RevenueReportsProps> = ({
  data,
  comparisonMode,
  timeRange
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  // Calculate total revenue
  const totalRevenue = data.total.reduce((sum, val) => sum + val, 0);
  // Calculate period over period change
  const calculateChange = (values: number[]) => {
    if (values.length < 2) return 0;
    const currentValue = values[values.length - 1];
    const previousValue = values[0];
    return (currentValue - previousValue) / previousValue * 100;
  };
  const revenueChange = calculateChange(data.total);
  return <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <DollarSignIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="flex items-center text-sm">
            <span className={`flex items-center ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
              {Math.abs(revenueChange).toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-2">vs. previous period</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Revenue Forecast
            </h3>
            <TrendingUpIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">Next Month</div>
              <div className="font-medium text-gray-900">
                {formatCurrency(data.projections.nextMonth)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">Next Quarter</div>
              <div className="font-medium text-gray-900">
                {formatCurrency(data.projections.nextQuarter)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">Next Year</div>
              <div className="font-medium text-gray-900">
                {formatCurrency(data.projections.nextYear)}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Key Metrics</h3>
            <TagIcon className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">ARPU</div>
              <div className="font-medium text-gray-900">${data.arpu}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">Top Revenue Source</div>
              <div className="font-medium text-gray-900">
                {data.revenueBreakdown.sort((a, b) => b.amount - a.amount)[0].source}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Revenue Breakdown
        </h3>
        <div className="space-y-4">
          {data.revenueBreakdown.map(item => <div key={item.source} className="flex items-center">
              <div className="w-32 flex-shrink-0">
                <div className="flex items-center">
                  {item.source === 'Subscriptions' && <CreditCardIcon className="h-4 w-4 text-indigo-500 mr-1.5" />}
                  {item.source === 'Sponsors' && <TagIcon className="h-4 w-4 text-purple-500 mr-1.5" />}
                  {item.source === 'Marketplace' && <ShoppingCartIcon className="h-4 w-4 text-green-500 mr-1.5" />}
                  <span className="text-sm font-medium text-gray-900">
                    {item.source}
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`absolute top-0 left-0 h-full rounded-full ${item.source === 'Subscriptions' ? 'bg-indigo-500' : item.source === 'Sponsors' ? 'bg-purple-500' : 'bg-green-500'}`} style={{
                width: `${item.amount / totalRevenue * 100}%`
              }}></div>
                </div>
              </div>
              <div className="w-24 flex-shrink-0 text-right">
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <div className="w-20 flex-shrink-0 text-right">
                <span className="text-sm text-gray-500">
                  {(item.amount / totalRevenue * 100).toFixed(1)}%
                </span>
              </div>
            </div>)}
        </div>
      </div>
      {/* Revenue Chart would go here */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Revenue Trends
        </h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          Revenue chart visualization would be implemented here
        </div>
      </div>
    </div>;
};
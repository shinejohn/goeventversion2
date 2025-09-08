'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Star,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@kit/ui/cn';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    chart: Array<{ date: string; amount: number }>;
  };
  orders: {
    total: number;
    change: number;
    chart: Array<{ date: string; count: number }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    change: number;
  };
  products: {
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
      imageUrl: string;
    }>;
    lowStock: Array<{
      id: string;
      name: string;
      stock: number;
      imageUrl: string;
    }>;
    performance: Array<{
      id: string;
      name: string;
      views: number;
      conversionRate: number;
    }>;
  };
  ratings: {
    average: number;
    total: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  geographic: {
    topCities: Array<{ city: string; orders: number; revenue: number }>;
    topStates: Array<{ state: string; orders: number; revenue: number }>;
  };
}

interface VendorAnalyticsProps {
  vendor: {
    id: string;
    businessName: string;
    status: string;
  };
  period: string;
  analytics: AnalyticsData;
  comparePeriod: string;
}

export function VendorAnalytics({
  vendor,
  period,
  analytics,
  comparePeriod
}: VendorAnalyticsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  const handlePeriodChange = (value: string) => {
    setSearchParams(prev => {
      prev.set('period', value);
      return prev;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(1)}%`;
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon,
    format = 'number' 
  }: { 
    title: string; 
    value: number; 
    change: number; 
    icon: React.ElementType;
    format?: 'number' | 'currency';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {format === 'currency' ? formatCurrency(value) : value.toLocaleString()}
        </div>
        <div className={cn(
          "flex items-center text-sm mt-1",
          change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
        )}>
          {change > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : change < 0 ? <ArrowDownRight className="w-4 h-4 mr-1" /> : null}
          {formatPercentage(change)} vs {comparePeriod}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your sales performance and customer insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={analytics.revenue.total}
          change={analytics.revenue.change}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Total Orders"
          value={analytics.orders.total}
          change={analytics.orders.change}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Customers"
          value={analytics.customers.total}
          change={analytics.customers.change}
          icon={Users}
        />
        <StatCard
          title="Average Rating"
          value={analytics.ratings.average}
          change={0}
          icon={Star}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <LineChart className="w-8 h-8 mr-2" />
                  Revenue chart would go here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mr-2" />
                  Orders chart would go here
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Customers</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{analytics.customers.new}</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${(analytics.customers.new / analytics.customers.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Returning Customers</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{analytics.customers.returning}</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${(analytics.customers.returning / analytics.customers.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Cities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.geographic.topCities.slice(0, 5).map((city, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{city.city}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">{city.orders} orders</span>
                        <p className="text-xs text-muted-foreground">{formatCurrency(city.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top States</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.geographic.topStates.slice(0, 5).map((state, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{state.state}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">{state.orders} orders</span>
                        <p className="text-xs text-muted-foreground">{formatCurrency(state.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <LineChart className="w-8 h-8 mr-2" />
                Detailed revenue analytics would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.products.topSelling.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} sales • {formatCurrency(product.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.products.lowStock.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      All products are well stocked!
                    </p>
                  ) : (
                    analytics.products.lowStock.map((product) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-red-600">
                            Only {product.stock} left in stock
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Product</th>
                      <th className="text-right p-2">Views</th>
                      <th className="text-right p-2">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.products.performance.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2 text-right">{product.views.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <span className={cn(
                            "font-medium",
                            product.conversionRate > 5 ? "text-green-600" : 
                            product.conversionRate > 2 ? "text-amber-600" : "text-red-600"
                          )}>
                            {product.conversionRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <Users className="w-8 h-8 mr-2" />
                Customer analytics would go here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = analytics.ratings.distribution[rating as keyof typeof analytics.ratings.distribution];
                  const percentage = analytics.ratings.total > 0 ? (count / analytics.ratings.total) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold">{analytics.ratings.average.toFixed(1)}</span>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{analytics.ratings.total}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
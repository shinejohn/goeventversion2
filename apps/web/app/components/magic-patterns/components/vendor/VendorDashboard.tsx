'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Star,
  Clock,
  AlertCircle,
  BarChart
} from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@kit/ui/cn';

interface VendorDashboardProps {
  vendor: {
    id: string;
    businessName: string;
    status: string;
    isVerified: boolean;
    stripeAccountId?: string;
  } | null;
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    pendingPayouts: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    imageUrl: string;
    sales: number;
    revenue: number;
    rating: number;
  }>;
}

export function VendorDashboard({
  vendor,
  stats,
  recentOrders,
  topProducts
}: VendorDashboardProps) {
  if (!vendor) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Vendor Profile Found</h2>
            <p className="text-muted-foreground mb-4">
              You need to set up your vendor profile to access the dashboard.
            </p>
            <Button asChild>
              <Link to="/dashboard/vendor/setup">Create Vendor Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{vendor.businessName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
              {vendor.status}
            </Badge>
            {vendor.isVerified && (
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                Verified
              </Badge>
            )}
          </div>
        </div>
        <Button asChild>
          <Link to="/dashboard/vendor/products">
            <Package className="w-4 h-4 mr-2" />
            Manage Products
          </Link>
        </Button>
      </div>

      {!vendor.stripeAccountId && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-sm">
                <strong>Action Required:</strong> Connect your Stripe account to receive payouts.{' '}
                <Link to="/dashboard/vendor/payouts" className="text-blue-600 hover:underline">
                  Connect Now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating.toFixed(1)}
              <span className="text-sm text-muted-foreground">/5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingPayouts.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.productName} x {order.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                      <Badge 
                        variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'processing' ? 'secondary' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="link" className="w-full mt-4" asChild>
              <Link to="/dashboard/vendor/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No products yet</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} sales • ${product.revenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="link" className="w-full mt-4" asChild>
              <Link to="/dashboard/vendor/products">View All Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard/vendor/products/new">
                <Package className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/vendor/orders">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Manage Orders
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/vendor/analytics">
                <BarChart className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/vendor/payouts">
                <DollarSign className="w-4 h-4 mr-2" />
                View Payouts
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
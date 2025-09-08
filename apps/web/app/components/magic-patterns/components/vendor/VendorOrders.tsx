'use client';

import React, { useState } from 'react';
import { Form, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Badge } from '@kit/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@kit/ui/dialog';
import { Textarea } from '@kit/ui/textarea';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  DollarSign,
  User,
  Calendar
} from 'lucide-react';
import { cn } from '@kit/ui/cn';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productName: string;
    variantName?: string;
    quantity: number;
    price: number;
    status: string;
  }>;
  totalAmount: number;
  vendorAmount: number;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface VendorOrdersProps {
  vendor: {
    id: string;
    businessName: string;
    status: string;
  };
  orders: Order[];
  stats: {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    revenue: {
      today: number;
      week: number;
      month: number;
    };
  };
  filters: {
    search: string;
    status: string;
    dateRange: string;
    sort: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function VendorOrders({
  vendor,
  orders,
  stats,
  filters,
  pagination
}: VendorOrdersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [fulfillmentDialogOpen, setFulfillmentDialogOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    setSearchParams(prev => {
      if (search) {
        prev.set('search', search);
      } else {
        prev.delete('search');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 border-amber-600';
      case 'processing':
        return 'text-blue-600 border-blue-600';
      case 'completed':
        return 'text-green-600 border-green-600';
      case 'cancelled':
        return 'text-red-600 border-red-600';
      default:
        return '';
    }
  };

  const getFulfillmentColor = (status: string) => {
    switch (status) {
      case 'unfulfilled':
        return 'bg-gray-100 text-gray-700';
      case 'partially_fulfilled':
        return 'bg-amber-100 text-amber-700';
      case 'fulfilled':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and fulfill customer orders</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/dashboard/vendor/orders/export" download>
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processingOrders}</div>
            <p className="text-xs text-muted-foreground">Being fulfilled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
              <Input
                name="search"
                placeholder="Search by order # or customer..."
                defaultValue={filters.search}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </form>

            <div className="flex gap-2">
              <Select
                value={filters.dateRange}
                onValueChange={(value) => {
                  setSearchParams(prev => {
                    if (value === 'all') {
                      prev.delete('dateRange');
                    } else {
                      prev.set('dateRange', value);
                    }
                    prev.set('page', '1');
                    return prev;
                  });
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="quarter">This quarter</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sort}
                onValueChange={(value) => {
                  setSearchParams(prev => {
                    prev.set('sort', value);
                    return prev;
                  });
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest first</SelectItem>
                  <SelectItem value="date-asc">Oldest first</SelectItem>
                  <SelectItem value="amount-desc">Highest amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Fulfillment</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found. Orders will appear here when customers purchase your products.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs mt-1", getStatusColor(order.paymentStatus))}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium line-clamp-1">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm line-clamp-1">
                              {item.productName} x {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 text-right">
                        <div>
                          <p className="font-medium">${order.vendorAmount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">of ${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(order.status)}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge 
                          variant="secondary"
                          className={getFulfillmentColor(order.fulfillmentStatus)}
                        >
                          {order.fulfillmentStatus.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="p-2">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <Form method="post" action="/dashboard/vendor/orders">
                              <input type="hidden" name="_action" value="accept-order" />
                              <input type="hidden" name="orderId" value={order.id} />
                              <Button type="submit" variant="outline" size="sm">
                                Accept
                              </Button>
                            </Form>
                          )}
                          {order.status === 'processing' && order.fulfillmentStatus === 'unfulfilled' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setFulfillmentDialogOpen(true);
                              }}
                            >
                              Fulfill
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => {
                  setSearchParams(prev => {
                    prev.set('page', String(pagination.page - 1));
                    return prev;
                  });
                }}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => {
                  setSearchParams(prev => {
                    prev.set('page', String(pagination.page + 1));
                    return prev;
                  });
                }}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && !fulfillmentDialogOpen && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>
                Order details and customer information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Customer</h4>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.line1}<br />
                    {selectedOrder.shippingAddress.line2 && <>{selectedOrder.shippingAddress.line2}<br /></>}
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="border rounded-lg p-4 space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                      </div>
                      <div className="text-right">
                        <p>{item.quantity} x ${item.price.toFixed(2)}</p>
                        <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Your Earnings (after commission)</span>
                    <span>${selectedOrder.vendorAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                  <Badge variant="secondary" className={cn("ml-2", getFulfillmentColor(selectedOrder.fulfillmentStatus))}>
                    {selectedOrder.fulfillmentStatus.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Fulfillment Dialog */}
      {selectedOrder && fulfillmentDialogOpen && (
        <Dialog open={fulfillmentDialogOpen} onOpenChange={setFulfillmentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fulfill Order</DialogTitle>
              <DialogDescription>
                Mark order as fulfilled and provide tracking information
              </DialogDescription>
            </DialogHeader>
            <Form method="post" action="/dashboard/vendor/orders">
              <input type="hidden" name="_action" value="fulfill-order" />
              <input type="hidden" name="orderId" value={selectedOrder.id} />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    name="trackingNumber"
                    placeholder="Enter tracking number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrier">Shipping Carrier</Label>
                  <Select name="carrier" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usps">USPS</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any notes about the fulfillment"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setFulfillmentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Mark as Fulfilled
                  </Button>
                </div>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
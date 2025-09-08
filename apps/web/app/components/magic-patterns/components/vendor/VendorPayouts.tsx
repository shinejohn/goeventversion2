'use client';

import React, { useState } from 'react';
import { Form, useSearchParams, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { 
  DollarSign, 
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  TrendingUp,
  Banknote,
  Info
} from 'lucide-react';
import { cn } from '@kit/ui/cn';

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank_transfer' | 'stripe';
  processedAt?: string;
  createdAt: string;
  statementDescriptor: string;
  bankAccount?: {
    last4: string;
    bankName: string;
  };
}

interface VendorPayoutsProps {
  vendor: {
    id: string;
    businessName: string;
    stripeAccountId?: string;
    payoutMethod?: 'bank_transfer' | 'stripe';
  };
  balance: {
    available: number;
    pending: number;
    reserved: number;
  };
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  payouts: Payout[];
  nextPayoutDate?: string;
  minimumPayout: number;
  filters: {
    status: string;
    dateRange: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function VendorPayouts({
  vendor,
  balance,
  earnings,
  payouts,
  nextPayoutDate,
  minimumPayout,
  filters,
  pagination
}: VendorPayoutsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPayoutDetails, setShowPayoutDetails] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return '';
    }
  };

  const canRequestPayout = vendor.stripeAccountId && balance.available >= minimumPayout;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payouts</h1>
          <p className="text-muted-foreground">Manage your earnings and payment settings</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/dashboard/vendor/payouts/export" download>
            <Download className="w-4 h-4 mr-2" />
            Export History
          </a>
        </Button>
      </div>

      {!vendor.stripeAccountId && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connect Your Stripe Account</AlertTitle>
          <AlertDescription>
            To receive payouts, you need to connect your Stripe account. This allows us to securely transfer your earnings.
            <Button className="mt-2" asChild>
              <Link to="/dashboard/vendor/payouts/connect-stripe">
                <CreditCard className="w-4 h-4 mr-2" />
                Connect Stripe Account
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance.available)}</div>
            <p className="text-xs text-muted-foreground">Ready for payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance.pending)}</div>
            <p className="text-xs text-muted-foreground">Processing orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earnings.thisMonth)}</div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earnings.total)}</div>
            <p className="text-xs text-muted-foreground">Total earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Balance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Available for Payout</p>
                  <p className="text-sm text-muted-foreground">Completed orders minus fees</p>
                </div>
                <p className="text-xl font-bold text-green-600">{formatCurrency(balance.available)}</p>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Pending Clearance</p>
                  <p className="text-sm text-muted-foreground">Awaiting order completion</p>
                </div>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(balance.pending)}</p>
              </div>

              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Reserved</p>
                  <p className="text-sm text-muted-foreground">Held for disputes or refunds</p>
                </div>
                <p className="text-xl font-bold text-red-600">{formatCurrency(balance.reserved)}</p>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Minimum Payout</p>
                  <p className="font-medium">{formatCurrency(minimumPayout)}</p>
                </div>
                {nextPayoutDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Next automatic payout: {new Date(nextPayoutDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {vendor.stripeAccountId && (
              <Form method="post" action="/dashboard/vendor/payouts" className="mt-6">
                <input type="hidden" name="_action" value="request-payout" />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!canRequestPayout}
                >
                  Request Payout
                </Button>
                {!canRequestPayout && balance.available < minimumPayout && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Minimum {formatCurrency(minimumPayout)} required for payout
                  </p>
                )}
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm">Today</p>
                <p className="font-medium">{formatCurrency(earnings.today)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">This Week</p>
                <p className="font-medium">{formatCurrency(earnings.thisWeek)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">This Month</p>
                <p className="font-medium">{formatCurrency(earnings.thisMonth)}</p>
              </div>
              <div className="pt-3 border-t flex justify-between items-center">
                <p className="font-medium">Total Earnings</p>
                <p className="font-bold text-lg">{formatCurrency(earnings.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payout History</CardTitle>
            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) => {
                  setSearchParams(prev => {
                    if (value === 'all') {
                      prev.delete('status');
                    } else {
                      prev.set('status', value);
                    }
                    prev.set('page', '1');
                    return prev;
                  });
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

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
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8">
              <Banknote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No payouts yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your payouts will appear here once you start receiving them
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Method</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <p className="text-sm">{new Date(payout.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payout.createdAt).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="p-2 font-medium">{formatCurrency(payout.amount)}</td>
                        <td className="p-2">
                          <Badge variant="secondary" className={getStatusColor(payout.status)}>
                            {payout.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {payout.method === 'bank_transfer' ? (
                              <>
                                <CreditCard className="w-4 h-4" />
                                <span className="text-sm">Bank ••{payout.bankAccount?.last4}</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4" />
                                <span className="text-sm">Stripe</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-2 text-sm">{payout.statementDescriptor}</td>
                        <td className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPayoutDetails(payout.id)}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
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
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Payout Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Payouts are processed automatically when your balance reaches {formatCurrency(minimumPayout)}</li>
              <li>Manual payouts can be requested at any time above the minimum threshold</li>
              <li>Bank transfers typically take 2-5 business days to complete</li>
              <li>A 10% platform commission is deducted from all sales</li>
              <li>For tax purposes, you'll receive a 1099 form if earnings exceed $600/year</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
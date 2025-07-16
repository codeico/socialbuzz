'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import {
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Monitor,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface DashboardData {
  user: any;
  stats: {
    balance: number;
    totalEarnings: number;
    totalDonations: number;
    monthlyEarnings: number;
  };
  recentTransactions: any[];
  recentDonations: any[];
}

export default function OptimizedDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/v1/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
          return;
        }
        throw new Error(result.error || 'Failed to load dashboard data');
      }

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = () => {
    setLoading(true);
    loadDashboardData();
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div>
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderError = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to load dashboard</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderOverview = () => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {data.user?.full_name}!</h1>
            <p className="text-gray-600">Here&apos;s what&apos;s happening with your account today.</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.stats.balance)}</div>
              <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.stats.totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.stats.totalDonations)}</div>
              <p className="text-xs text-muted-foreground">Amount you&apos;ve donated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.stats.monthlyEarnings)}</div>
              <p className="text-xs text-muted-foreground">Monthly earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common actions you can take</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  alert('Payout request feature will be implemented');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Request Payout
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => window.open(`/obs/${data.user?.id}`, '_blank')}
              >
                <Monitor className="mr-2 h-4 w-4" />
                OBS Overlay
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => window.open(`/widget/${data.user?.username}`, '_blank')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Donation Widget
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => window.open(`/profile/${data.user?.username}`, '_blank')}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentTransactions.length > 0 ? (
                  data.recentTransactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {transaction.type === 'donation' ? (
                          <ArrowDownRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            transaction.type === 'donation' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'donation' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent transactions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Donations */}
        {data.recentDonations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations Received</CardTitle>
              <CardDescription>Latest support from your community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentDonations.map(donation => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                        <Gift className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {formatCurrency(donation.amount)} from {donation.donorName}
                        </p>
                        {donation.message && (
                          <p className="text-xs text-gray-600">&quot;{donation.message}&quot;</p>
                        )}
                        <p className="text-xs text-gray-500">{formatDate(donation.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="p-6">{renderLoadingSkeleton()}</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return renderError();
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-6">{renderOverview()}</div>
    </DashboardLayout>
  );
}
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
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
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    balance: 0,
    totalEarnings: 0,
    totalDonations: 0,
    monthlyEarnings: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const router = useRouter();

  const loadDashboardData = useCallback(async () => {
    setDataLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Use single optimized API call
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
        const { stats, recentTransactions, recentDonations } = result.data;
        setStats(stats);
        setRecentTransactions(recentTransactions || []);
        setRecentDonations(recentDonations || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set empty states on error
      setStats({
        balance: 0,
        totalEarnings: 0,
        totalDonations: 0,
        monthlyEarnings: 0,
      });
      setRecentTransactions([]);
      setRecentDonations([]);
    } finally {
      setDataLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Load all dashboard data in a single call
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your account today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
            <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalDonations)}</div>
            <p className="text-xs text-muted-foreground">Amount you&apos;ve donated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyEarnings)}</div>
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
                // TODO: Implement payout request modal/page
                alert('Payout request feature will be implemented');
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Request Payout
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.open(`/obs/${user?.id}/settings`, '_blank')}
            >
              <Monitor className="mr-2 h-4 w-4" />
              OBS Setup
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.open(`/widget/${user?.id}`, '_blank')}
            >
              <Zap className="mr-2 h-4 w-4" />
              Donation Widget
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.open(`/profile/${user?.username}`, '_blank')}
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
              {recentTransactions.length > 0 ? (
                recentTransactions.map(transaction => (
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
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
    case 'overview':
      return renderOverview();
    default:
      return renderOverview();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show skeleton while data is loading
  if (dataLoading && recentTransactions.length === 0) {
    return (
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="p-6 space-y-6">
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
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-6">{renderContent()}</div>
    </DashboardLayout>
  );
}

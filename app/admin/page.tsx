'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  totalTransactions: number;
  pendingPayouts: number;
  todayRevenue: number;
  todayTransactions: number;
  userGrowth: number;
  revenueGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'transaction_completed' | 'payout_requested';
  user: string;
  amount?: number;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalRevenue: 2450000,
    totalTransactions: 3456,
    pendingPayouts: 12,
    todayRevenue: 45000,
    todayTransactions: 23,
    userGrowth: 12.5,
    revenueGrowth: 8.3,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user_registered',
      user: 'John Doe',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'transaction_completed',
      user: 'Jane Smith',
      amount: 50000,
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '3',
      type: 'payout_requested',
      user: 'Mike Johnson',
      amount: 250000,
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // For now, just simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would fetch real data:
      // const token = localStorage.getItem('token');
      // const response = await fetch('/api/v1/admin/dashboard/stats', {
      //   headers: { 'Authorization': `Bearer ${token}` },
      // });
      
      setLoading(false);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', error);
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'transaction_completed':
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case 'payout_requested':
        return <DollarSign className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'user_registered':
        return `${activity.user} registered as a new user`;
      case 'transaction_completed':
        return `${activity.user} completed a transaction of ${formatCurrency(activity.amount || 0)}`;
      case 'payout_requested':
        return `${activity.user} requested a payout of ${formatCurrency(activity.amount || 0)}`;
      default:
        return `${activity.user} performed an action`;
    }
  };

  return (
    <AdminLayout activeTab="overview">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to the SocialBuzz administration panel</p>
            </div>
            <Button onClick={loadDashboardData} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stats.userGrowth >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(stats.userGrowth).toFixed(1)}%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stats.revenueGrowth >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(stats.revenueGrowth).toFixed(1)}%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.todayTransactions} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayouts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
              <CardDescription>Performance metrics for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats.todayRevenue)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.todayTransactions}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {getActivityText(activity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => window.location.href = '/admin/transactions'}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                View Transactions
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => window.location.href = '/admin/payouts'}
              >
                <DollarSign className="h-6 w-6 mb-2" />
                Process Payouts
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => window.location.href = '/admin/reports'}
              >
                <BarChart3 className="h-6 w-6 mb-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
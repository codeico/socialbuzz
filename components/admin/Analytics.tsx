'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Eye,
  UserPlus,
  CreditCard,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    totalRevenue: number;
    totalTransactions: number;
    averageTransaction: number;
    platformFees: number;
    growthRate: number;
  };
  userMetrics: {
    signups: Array<{ date: string; count: number }>;
    retention: Array<{ period: string; rate: number }>;
    topCreators: Array<{ name: string; earnings: number; supporters: number }>;
  };
  revenueMetrics: {
    daily: Array<{ date: string; revenue: number; transactions: number }>;
    monthly: Array<{ month: string; revenue: number; growth: number }>;
    categories: Array<{ category: string; revenue: number; percentage: number }>;
  };
  transactionMetrics: {
    volume: Array<{ date: string; volume: number; count: number }>;
    methods: Array<{ method: string; count: number; percentage: number }>;
    averageAmounts: Array<{ range: string; count: number }>;
  };
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Mock analytics data
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalUsers: 2847,
          activeUsers: 1234,
          newUsersToday: 23,
          totalRevenue: 458923000,
          totalTransactions: 15632,
          averageTransaction: 29350,
          platformFees: 22946000,
          growthRate: 15.8,
        },
        userMetrics: {
          signups: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 50) + 10,
          })),
          retention: [
            { period: '1 day', rate: 85.2 },
            { period: '7 days', rate: 62.1 },
            { period: '30 days', rate: 34.7 },
            { period: '90 days', rate: 18.9 },
          ],
          topCreators: [
            { name: 'John Doe', earnings: 5200000, supporters: 234 },
            { name: 'Sarah Smith', earnings: 3800000, supporters: 189 },
            { name: 'Mike Johnson', earnings: 2100000, supporters: 145 },
            { name: 'Lisa Anderson', earnings: 1650000, supporters: 98 },
            { name: 'Alex Chen', earnings: 1420000, supporters: 87 },
          ],
        },
        revenueMetrics: {
          daily: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 2000000) + 500000,
            transactions: Math.floor(Math.random() * 100) + 20,
          })),
          monthly: [
            { month: 'Jan', revenue: 42300000, growth: 12.5 },
            { month: 'Feb', revenue: 38900000, growth: -8.0 },
            { month: 'Mar', revenue: 51200000, growth: 31.6 },
            { month: 'Apr', revenue: 47800000, growth: -6.6 },
            { month: 'May', revenue: 55100000, growth: 15.3 },
            { month: 'Jun', revenue: 61200000, growth: 11.1 },
          ],
          categories: [
            { category: 'Gaming', revenue: 145600000, percentage: 35.2 },
            { category: 'Art & Design', revenue: 98400000, percentage: 23.8 },
            { category: 'Music', revenue: 87200000, percentage: 21.1 },
            { category: 'Education', revenue: 45300000, percentage: 10.9 },
            { category: 'Other', revenue: 37200000, percentage: 9.0 },
          ],
        },
        transactionMetrics: {
          volume: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            volume: Math.floor(Math.random() * 5000000) + 1000000,
            count: Math.floor(Math.random() * 200) + 50,
          })),
          methods: [
            { method: 'Credit Card', count: 8924, percentage: 57.1 },
            { method: 'Bank Transfer', count: 3876, percentage: 24.8 },
            { method: 'E-Wallet', count: 2156, percentage: 13.8 },
            { method: 'Virtual Account', count: 676, percentage: 4.3 },
          ],
          averageAmounts: [
            { range: '< Rp 50k', count: 4523 },
            { range: 'Rp 50k - 100k', count: 3876 },
            { range: 'Rp 100k - 500k', count: 5234 },
            { range: 'Rp 500k - 1M', count: 1567 },
            { range: '> Rp 1M', count: 432 },
          ],
        },
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverviewCards = () => {
    if (!analytics) {
      return null;
    }

    const { overview } = analytics;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{overview.newUsersToday} today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{overview.growthRate}% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalTransactions.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Avg: {formatCurrency(overview.averageTransaction)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.platformFees)}</div>
            <div className="text-xs text-muted-foreground">
              {((overview.platformFees / overview.totalRevenue) * 100).toFixed(1)}% of revenue
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTopCreators = () => {
    if (!analytics) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Creators</CardTitle>
          <CardDescription>Highest earning creators this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.userMetrics.topCreators.map((creator, index) => (
              <div key={creator.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{creator.name}</p>
                    <p className="text-sm text-gray-500">{creator.supporters} supporters</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(creator.earnings)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRevenueByCategory = () => {
    if (!analytics) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
          <CardDescription>Revenue distribution across content categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.revenueMetrics.categories.map(category => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{category.category}</span>
                  <span>
                    {formatCurrency(category.revenue)} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${category.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPaymentMethods = () => {
    if (!analytics) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Transaction distribution by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.transactionMetrics.methods.map(method => (
              <div key={method.method} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{method.method}</span>
                  <span>
                    {method.count.toLocaleString()} ({method.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${method.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUserRetention = () => {
    if (!analytics) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>User Retention</CardTitle>
          <CardDescription>User retention rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.userMetrics.retention.map(retention => (
              <div key={retention.period} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{retention.period}</span>
                  <span>{retention.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${retention.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600">Platform performance and user behavior analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading analytics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Cards */}
          {renderOverviewCards()}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderTopCreators()}
            {renderRevenueByCategory()}
            {renderPaymentMethods()}
            {renderUserRetention()}
          </div>

          {/* Transaction Amount Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Amount Distribution</CardTitle>
              <CardDescription>Distribution of transaction amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {analytics?.transactionMetrics.averageAmounts.map(range => (
                  <div key={range.range} className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{range.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{range.range}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth Trends</CardTitle>
              <CardDescription>Key metrics and growth indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">+{analytics?.overview.growthRate}%</div>
                  <div className="text-sm text-gray-600">Monthly Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {analytics?.overview.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {formatCurrency(analytics?.overview.averageTransaction || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Transaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

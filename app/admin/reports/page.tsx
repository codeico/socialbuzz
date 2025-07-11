'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import {
  BarChart3,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  PieChart,
  LineChart,
} from 'lucide-react';

interface ReportStats {
  totalRevenue: number;
  totalTransactions: number;
  totalUsers: number;
  totalCreators: number;
  averageTransactionAmount: number;
  successRate: number;
  revenueGrowth: number;
  userGrowth: number;
  transactionGrowth: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
}

interface TopCreator {
  id: string;
  username: string;
  full_name: string;
  total_earnings: number;
  total_donations: number;
  donation_count: number;
}

interface TopDonor {
  id: string;
  username: string;
  full_name: string;
  total_donations: number;
  donation_count: number;
}

interface TransactionTrend {
  status: string;
  count: number;
  amount: number;
  percentage: number;
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<ReportStats>({
    totalRevenue: 0,
    totalTransactions: 0,
    totalUsers: 0,
    totalCreators: 0,
    averageTransactionAmount: 0,
    successRate: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    transactionGrowth: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [transactionTrends, setTransactionTrends] = useState<TransactionTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        days: dateRange,
        type: reportType,
      });

      const response = await fetch(`/api/v1/admin/reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setRevenueData(data.data.revenueData || []);
        setTopCreators(data.data.topCreators || []);
        setTopDonors(data.data.topDonors || []);
        setTransactionTrends(data.data.transactionTrends || []);
        setError('');
      } else {
        setError(data.error || 'Failed to load reports');
      }
    } catch (error) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [dateRange, reportType]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const exportReport = async (type: string) => {
    try {
      const params = new URLSearchParams({
        days: dateRange,
        type,
        format: 'csv',
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/reports/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      // console.error('Export error:', error);
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    } else if (growth < 0) {
      return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    }
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) {
      return 'text-green-600';
    }
    if (growth < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  if (loading && revenueData.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="reports">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="mt-2 text-gray-600">Comprehensive platform analytics and performance metrics</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadReports} variant="outline" disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => exportReport('overview')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Report Type</label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="overview">Overview</option>
                    <option value="revenue">Revenue</option>
                    <option value="users">Users</option>
                    <option value="transactions">Transactions</option>
                    <option value="creators">Creators</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  <div className={`mt-2 flex items-center text-sm ${getGrowthColor(stats.revenueGrowth)}`}>
                    {getGrowthIcon(stats.revenueGrowth)}
                    <span className="ml-1">{Math.abs(stats.revenueGrowth).toFixed(1)}%</span>
                  </div>
                </div>
                <DollarSign className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
                  <div className={`mt-2 flex items-center text-sm ${getGrowthColor(stats.transactionGrowth)}`}>
                    {getGrowthIcon(stats.transactionGrowth)}
                    <span className="ml-1">{Math.abs(stats.transactionGrowth).toFixed(1)}%</span>
                  </div>
                </div>
                <Activity className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <div className={`mt-2 flex items-center text-sm ${getGrowthColor(stats.userGrowth)}`}>
                    {getGrowthIcon(stats.userGrowth)}
                    <span className="ml-1">{Math.abs(stats.userGrowth).toFixed(1)}%</span>
                  </div>
                </div>
                <Users className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
                  <p className="mt-2 text-sm text-gray-500">Avg: {formatCurrency(stats.averageTransactionAmount)}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Daily revenue over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                {revenueData.length > 0 ? (
                  <div className="w-full">
                    <div className="mb-4 text-sm text-gray-600">Revenue by Day</div>
                    {revenueData.slice(-7).map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm">{formatDate(item.date)}</span>
                        <span className="font-semibold">{formatCurrency(item.revenue)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No revenue data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Transaction Status
              </CardTitle>
              <CardDescription>Breakdown of transaction statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`mr-3 h-3 w-3 rounded-full ${
                          trend.status === 'completed'
                            ? 'bg-green-500'
                            : trend.status === 'pending'
                              ? 'bg-yellow-500'
                              : trend.status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-gray-500'
                        }`}
                      ></div>
                      <span className="text-sm font-medium capitalize">{trend.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{trend.count}</div>
                      <div className="text-xs text-gray-500">{trend.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Creators */}
          <Card>
            <CardHeader>
              <CardTitle>Top Creators</CardTitle>
              <CardDescription>Highest earning creators this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCreators.map((creator, index) => (
                  <div key={creator.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                        <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{creator.full_name}</p>
                        <p className="text-sm text-gray-500">@{creator.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(creator.total_earnings)}</p>
                      <p className="text-sm text-gray-500">{creator.donation_count} donations</p>
                    </div>
                  </div>
                ))}
                {topCreators.length === 0 && (
                  <p className="py-4 text-center text-gray-500">No creator data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Donors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Donors</CardTitle>
              <CardDescription>Most generous supporters this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDonors.map((donor, index) => (
                  <div key={donor.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <span className="text-sm font-bold text-green-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{donor.full_name}</p>
                        <p className="text-sm text-gray-500">@{donor.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(donor.total_donations)}</p>
                      <p className="text-sm text-gray-500">{donor.donation_count} donations</p>
                    </div>
                  </div>
                ))}
                {topDonors.length === 0 && <p className="py-4 text-center text-gray-500">No donor data available</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>Download detailed reports in various formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                onClick={() => exportReport('revenue')}
                variant="outline"
                className="flex items-center justify-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Revenue Report
              </Button>
              <Button
                onClick={() => exportReport('users')}
                variant="outline"
                className="flex items-center justify-center"
              >
                <Users className="mr-2 h-4 w-4" />
                User Report
              </Button>
              <Button
                onClick={() => exportReport('transactions')}
                variant="outline"
                className="flex items-center justify-center"
              >
                <Activity className="mr-2 h-4 w-4" />
                Transaction Report
              </Button>
              <Button
                onClick={() => exportReport('creators')}
                variant="outline"
                className="flex items-center justify-center"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Creator Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

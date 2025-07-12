'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface Transaction {
  id: string;
  user_id: string;
  recipient_id: string | null;
  type: 'donation' | 'payout' | 'fee';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: string;
  merchant_order_id: string;
  reference: string | null;
  description: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  user?: {
    username: string;
    full_name: string;
    email: string;
  };
  recipient?: {
    username: string;
    full_name: string;
  };
}

interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  pendingTransactions: number;
  failedTransactions: number;
  completedTransactions: number;
  todayAmount: number;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalAmount: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    completedTransactions: 0,
    todayAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadTransactions();
    loadStats();
  }, [pagination.page, searchQuery, filterType, filterStatus, dateRange]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (dateRange !== 'all') params.append('date_range', dateRange);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/transactions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setTransactions(data.data);
        setPagination(data.pagination);
        setError('');
      } else {
        setError(data.error || 'Failed to load transactions');
      }
    } catch (error) {
      setError('Failed to load transactions');
      console.error('Transactions fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/transactions/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const handleTransactionAction = async (transactionId: string, action: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        loadTransactions();
        loadStats();
      } else {
        setError(data.error || 'Action failed');
      }
    } catch (error) {
      setError('Action failed');
      console.error('Transaction action error:', error);
    }
  };

  const exportTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (dateRange !== 'all') params.append('date_range', dateRange);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/transactions/export?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'donation': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'payout': return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case 'fee': return <CreditCard className="h-4 w-4 text-purple-600" />;
      default: return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'donation': return 'bg-green-100 text-green-800';
      case 'payout': return 'bg-blue-100 text-blue-800';
      case 'fee': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="transactions">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
              <p className="text-gray-600 mt-2">Monitor and manage all platform transactions</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadTransactions} variant="outline" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportTransactions} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-lg font-bold text-gray-900">{stats.completedTransactions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-lg font-bold text-gray-900">{stats.pendingTransactions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-lg font-bold text-gray-900">{stats.failedTransactions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.todayAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="donation">Donations</option>
                <option value="payout">Payouts</option>
                <option value="fee">Fees</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setDateRange('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
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

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({pagination.total})</CardTitle>
            <CardDescription>
              Showing {transactions.length} of {pagination.total} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-900">ID</th>
                    <th className="text-left p-4 font-medium text-gray-900">Type</th>
                    <th className="text-left p-4 font-medium text-gray-900">User</th>
                    <th className="text-left p-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Payment Method</th>
                    <th className="text-left p-4 font-medium text-gray-900">Date</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-mono text-xs text-gray-500">
                            {transaction.id.substring(0, 8)}...
                          </p>
                          <p className="font-mono text-xs text-gray-400">
                            {transaction.merchant_order_id}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          {getTypeIcon(transaction.type)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                            {transaction.type.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {transaction.user?.full_name || 'Unknown'}
                          </p>
                          <p className="text-gray-500">@{transaction.user?.username || 'unknown'}</p>
                          {transaction.recipient && (
                            <p className="text-xs text-gray-400">
                              → {transaction.recipient.full_name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {transaction.currency}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">
                          {transaction.payment_method.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{formatDate(transaction.created_at)}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(transaction.created_at).toLocaleTimeString()}
                          </p>
                          {transaction.completed_at && (
                            <p className="text-green-600 text-xs">
                              Completed: {formatDate(transaction.completed_at)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTransactionAction(transaction.id, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTransactionAction(transaction.id, 'cancel')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
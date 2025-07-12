'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePayment } from '@/hooks/usePayment';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { ArrowDownRight, ArrowUpRight, Filter, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionsPage() {
  const { getTransactions, loading } = usePayment();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const loadTransactions = useCallback(async () => {
    try {
      const result = await getTransactions({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder as 'asc' | 'desc',
      });

      setTransactions(result.data);
      setPagination(prev => ({
        ...prev,
        ...result.pagination,
      }));
    } catch (error) {
      // console.error('Error loading transactions:', error);
    }
  }, [pagination.page, pagination.limit, filters, getTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
    case 'donation':
      return <ArrowDownRight className="w-4 h-4 text-green-500" />;
    case 'payout':
      return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    default:
      return <ArrowUpRight className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout activeTab="transactions" onTabChange={() => {}}>
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
              <p className="text-gray-600">View and manage your transaction history</p>
            </div>
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter size={20} className="mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={e => handleFilterChange('type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="donation">Donations</option>
                    <option value="payout">Payouts</option>
                    <option value="fee">Fees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => handleFilterChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={e => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="created_at">Date</option>
                    <option value="amount">Amount</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={filters.sortOrder}
                    onChange={e => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>{pagination.total} total transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                          <p className="text-xs text-gray-500">ID: {transaction.merchant_order_id}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === 'donation' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'donation' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">via {transaction.payment_method.replace('_', ' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      <ChevronLeft size={16} />
                    </Button>

                    <span className="text-sm text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/utils/formatter';
import {
  DollarSign,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreHorizontal,
} from 'lucide-react';

interface PayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  bank_account: {
    bank_name: string;
    account_number: string;
    account_holder_name: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes: string | null;
  processed_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  user?: {
    username: string;
    full_name: string;
    email: string;
    balance: number;
  };
  processor?: {
    username: string;
    full_name: string;
  };
}

interface PayoutStats {
  totalRequests: number;
  totalAmount: number;
  pendingRequests: number;
  pendingAmount: number;
  completedRequests: number;
  completedAmount: number;
  rejectedRequests: number;
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [stats, setStats] = useState<PayoutStats>({
    totalRequests: 0,
    totalAmount: 0,
    pendingRequests: 0,
    pendingAmount: 0,
    completedRequests: 0,
    completedAmount: 0,
    rejectedRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    payout: PayoutRequest | null;
    action: 'approve' | 'reject' | null;
  }>({ isOpen: false, payout: null, action: null });
  const [actionNotes, setActionNotes] = useState('');

  const loadStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/payouts/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      // console.error('Stats fetch error:', error);
    }
  }, []);

  const loadPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/payouts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setPayouts(data.data);
        setPagination(data.pagination);
        setError('');
      } else {
        setError(data.error || 'Failed to load payouts');
      }
    } catch (error) {
      setError('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, filterStatus]);

  useEffect(() => {
    loadPayouts();
    loadStats();
  }, [loadPayouts, loadStats]);

  const handlePayoutAction = async (payoutId: string, action: string, notes?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/payouts/${payoutId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, notes }),
      });

      const data = await response.json();

      if (data.success) {
        setActionModal({ isOpen: false, payout: null, action: null });
        setActionNotes('');
        loadPayouts();
        loadStats();
      } else {
        setError(data.error || 'Action failed');
      }
    } catch (error) {
      setError('Action failed');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPayouts.length === 0) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/payouts/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payoutIds: selectedPayouts, action }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedPayouts([]);
        loadPayouts();
        loadStats();
      } else {
        setError(data.error || 'Bulk action failed');
      }
    } catch (error) {
      setError('Bulk action failed');
    }
  };

  const exportPayouts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/payouts/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payouts-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      // console.error('Export error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && payouts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading payouts...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="payouts">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
              <p className="mt-2 text-gray-600">Review and process creator payout requests</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadPayouts} variant="outline" disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportPayouts} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-10 w-10 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(stats.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-10 w-10 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(stats.pendingAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedRequests.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(stats.completedAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-10 w-10 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejectedRequests.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search payouts..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-64 pl-10"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {selectedPayouts.length > 0 && (
                <div className="flex gap-2">
                  <Button onClick={() => handleBulkAction('approve')} variant="outline" size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Selected
                  </Button>
                  <Button onClick={() => handleBulkAction('reject')} variant="outline" size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Selected
                  </Button>
                </div>
              )}
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

        {/* Payouts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Requests ({pagination.total})</CardTitle>
            <CardDescription>
              Showing {payouts.length} of {pagination.total} payout requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPayouts.length === payouts.length && payouts.length > 0}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedPayouts(payouts.map(p => p.id));
                          } else {
                            setSelectedPayouts([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">User</th>
                    <th className="p-4 text-left font-medium text-gray-900">Amount</th>
                    <th className="p-4 text-left font-medium text-gray-900">Bank Account</th>
                    <th className="p-4 text-left font-medium text-gray-900">Status</th>
                    <th className="p-4 text-left font-medium text-gray-900">Created</th>
                    <th className="p-4 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map(payout => (
                    <tr key={payout.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPayouts.includes(payout.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedPayouts([...selectedPayouts, payout.id]);
                            } else {
                              setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{payout.user?.full_name || 'Unknown'}</p>
                          <p className="text-gray-500">@{payout.user?.username || 'unknown'}</p>
                          <p className="text-xs text-gray-400">Balance: {formatCurrency(payout.user?.balance || 0)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(payout.amount)}</p>
                          <p className="text-xs text-gray-500">{payout.currency}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{payout.bank_account.bank_name}</p>
                          <p className="font-mono text-gray-500">{payout.bank_account.account_number}</p>
                          <p className="text-xs text-gray-500">{payout.bank_account.account_holder_name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          {getStatusIcon(payout.status)}
                          <span
                            className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(payout.status)}`}
                          >
                            {payout.status.toUpperCase()}
                          </span>
                        </div>
                        {payout.notes && <p className="mt-1 text-xs text-gray-500">Note: {payout.notes}</p>}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{formatDate(payout.created_at)}</p>
                          <p className="text-xs text-gray-500">{new Date(payout.created_at).toLocaleTimeString()}</p>
                          {payout.completed_at && (
                            <p className="text-xs text-green-600">Completed: {formatDate(payout.completed_at)}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payout.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    payout,
                                    action: 'approve',
                                  })
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    payout,
                                    action: 'reject',
                                  })
                                }
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
              <div className="mt-6 flex items-center justify-between">
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

        {/* Action Modal */}
        {actionModal.isOpen && actionModal.payout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {actionModal.action === 'approve' ? 'Approve' : 'Reject'} Payout Request
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  User: <span className="font-medium">{actionModal.payout.user?.full_name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Amount: <span className="font-medium">{formatCurrency(actionModal.payout.amount)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Bank: <span className="font-medium">{actionModal.payout.bank_account.bank_name}</span>
                </p>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes {actionModal.action === 'reject' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  placeholder={
                    actionModal.action === 'approve' ? 'Additional notes for approval...' : 'Reason for rejection...'
                  }
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setActionModal({ isOpen: false, payout: null, action: null });
                    setActionNotes('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handlePayoutAction(actionModal.payout!.id, actionModal.action!, actionNotes)}
                  className={`flex-1 ${
                    actionModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={actionModal.action === 'reject' && !actionNotes.trim()}
                >
                  {actionModal.action === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

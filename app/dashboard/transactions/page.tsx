'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { ArrowDownRight, ArrowUpRight, Filter, Download, Search, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function TransactionsPage() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newDonationIds, setNewDonationIds] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [pendingDonations, setPendingDonations] = useState<any[]>([]);
  const [showPendingBanner, setShowPendingBanner] = useState(false);
  const MAX_CONCURRENT_DONATIONS = 50; // Limit to prevent UI overload
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

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams();

        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());
        queryParams.append('sortBy', filters.sortBy);
        queryParams.append('sortOrder', filters.sortOrder);

        const response = await fetch(`/api/v1/donations/transactions?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          setTransactions(result.data.data || []);
          setPagination(prev => ({
            ...prev,
            ...result.data.pagination,
          }));
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
      }
    };

    loadTransactions();
  }, [pagination.page, pagination.limit, filters.sortBy, filters.sortOrder]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Get current user ID from token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.id);
    } catch (error) {
      console.error('Error parsing token:', error);
      return;
    }

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      const payload = JSON.parse(atob(token.split('.')[1]));
      newSocket.emit('join-creator-room', {
        creatorId: payload.id,
        token: token,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    newSocket.on('room-joined', (data) => {
      console.log('Joined creator room:', data);
    });

    newSocket.on('donation-alert', (donation) => {
      console.log('New donation received:', donation);
      // Add new donation to the beginning of the list if it's for current user
      if (donation.creatorId === currentUserId) {
        // Check if donation already exists to avoid duplicates
        setTransactions(prev => {
          const exists = prev.some(t => t.id === donation.id);
          if (!exists) {
            // Create transaction object that matches the API format
            const newTransaction = {
              id: donation.id,
              recipient_id: donation.creatorId,
              amount: donation.amount,
              message: donation.message,
              donor_name: donation.donorName,
              is_anonymous: donation.isAnonymous,
              payment_status: 'paid',
              payment_method: 'unknown',
              created_at: donation.timestamp,
              updated_at: donation.timestamp,
              paid_at: donation.timestamp,
            };
            
            // Add to pending donations queue for batch processing (with limit)
            setPendingDonations(pendingPrev => {
              if (pendingPrev.length >= MAX_CONCURRENT_DONATIONS) {
                console.warn('Max concurrent donations reached, dropping oldest');
                return [...pendingPrev.slice(1), newTransaction];
              }
              return [...pendingPrev, newTransaction];
            });
            
            return prev; // Don't immediately add to main list
          }
          return prev;
        });
      }
    });
    
    // Batch process pending donations every 2 seconds
    const processPendingDonations = setInterval(() => {
      setPendingDonations(pending => {
        if (pending.length > 0) {
          // Process in batches of 10 to avoid overwhelming the UI
          const batchSize = 10;
          const currentBatch = pending.slice(0, batchSize);
          const remainingPending = pending.slice(batchSize);
          
          setTransactions(prev => {
            // Add current batch to the beginning
            const newTransactions = [...currentBatch, ...prev];
            
            // Mark new donations
            currentBatch.forEach(donation => {
              setNewDonationIds(prevIds => new Set(Array.from(prevIds).concat(donation.id)));
              
              // Remove the "new" indicator after 10 seconds
              setTimeout(() => {
                setNewDonationIds(prevIds => {
                  const newSet = new Set(prevIds);
                  newSet.delete(donation.id);
                  return newSet;
                });
              }, 10000);
            });
            
            return newTransactions;
          });
          
          // Update pagination total
          setPagination(prev => ({
            ...prev,
            total: prev.total + currentBatch.length,
          }));
          
          // Show banner if many donations at once
          if (currentBatch.length > 1 || remainingPending.length > 0) {
            setShowPendingBanner(true);
            setTimeout(() => setShowPendingBanner(false), 5000);
          }
          
          return remainingPending; // Keep remaining pending donations
        }
        return pending;
      });
    }, 2000);

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      clearInterval(processPendingDonations);
    };
  }, [currentUserId]);

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

  const handleResendToOBS = async (donation: any) => {
    try {
      setLoading(true);
      
      const notificationData = {
        transactionId: donation.id,
        creatorId: donation.recipient_id,
        donorName: donation.donor_name,
        amount: donation.amount,
        message: donation.message || '',
        isAnonymous: donation.is_anonymous
      };

      const response = await fetch('/api/v1/notifications/donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Notification sent to OBS successfully!'
        });
      } else {
        setNotification({
          type: 'error',
          message: `Failed to send notification to OBS: ${result.error}`
        });
      }
    } catch (error) {
      console.error('Error sending to OBS:', error);
      setNotification({
        type: 'error',
        message: 'Error sending notification to OBS'
      });
    } finally {
      setLoading(false);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'expired':
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
    if (filters.status !== 'all' && transaction.payment_status !== filters.status) {
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
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-500">
                    {isConnected ? 'Real-time updates active' : 'Connecting...'}
                  </span>
                </div>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => handleFilterChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                    <option value="expired">Expired</option>
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
              
              {/* Pending Donations Banner */}
              {showPendingBanner && (
                <div className="mt-3 p-3 rounded-lg flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm font-medium">
                    Multiple donations received! Processing {pendingDonations.length} new donations...
                  </span>
                </div>
              )}
              
              {/* Notification */}
              {notification && (
                <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
                  notification.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">{notification.message}</span>
                </div>
              )}
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
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300 ${
                        newDonationIds.has(transaction.id) 
                          ? 'bg-green-50 border-green-200 shadow-md' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <ArrowDownRight className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">
                              {transaction.is_anonymous ? 'Anonymous Donor' : transaction.donor_name}
                            </p>
                            {newDonationIds.has(transaction.id) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {transaction.message || 'No message'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Donation ID: {transaction.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{formatCurrency(transaction.amount)}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.payment_status)}`}
                          >
                            {transaction.payment_status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            via {transaction.payment_method}
                          </p>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendToOBS(transaction)}
                          disabled={loading}
                          className="flex items-center space-x-1"
                        >
                          <Send size={14} />
                          <span>Resend to OBS</span>
                        </Button>
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

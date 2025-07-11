'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  DollarSign, 
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  CreditCard
} from 'lucide-react';

interface PayoutRequest {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  notes?: string;
  rejectionReason?: string;
}

interface PayoutManagementProps {
  onPayoutSelect?: (payout: PayoutRequest) => void;
}

export function PayoutManagement({ onPayoutSelect }: PayoutManagementProps) {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<PayoutRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('requestedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadPayouts();
  }, [pagination.page, sortBy, sortOrder]);

  useEffect(() => {
    filterPayouts();
  }, [payouts, searchQuery, statusFilter]);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      
      // Mock payout requests data
      const mockPayouts: PayoutRequest[] = [
        {
          id: '1',
          userId: '1',
          username: 'johndoe',
          fullName: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          amount: 2500000,
          fee: 50000,
          netAmount: 2450000,
          status: 'pending',
          bankDetails: {
            bankName: 'Bank Mandiri',
            accountNumber: '1234567890',
            accountHolderName: 'John Doe',
          },
          requestedAt: '2024-01-20T10:30:00Z',
        },
        {
          id: '2',
          userId: '2',
          username: 'sarahsmith',
          fullName: 'Sarah Smith',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          amount: 1800000,
          fee: 36000,
          netAmount: 1764000,
          status: 'approved',
          bankDetails: {
            bankName: 'Bank BCA',
            accountNumber: '0987654321',
            accountHolderName: 'Sarah Smith',
          },
          requestedAt: '2024-01-19T14:15:00Z',
          processedAt: '2024-01-20T09:00:00Z',
        },
        {
          id: '3',
          userId: '3',
          username: 'mikejohnson',
          fullName: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          amount: 5000000,
          fee: 100000,
          netAmount: 4900000,
          status: 'processing',
          bankDetails: {
            bankName: 'Bank BRI',
            accountNumber: '1122334455',
            accountHolderName: 'Mike Johnson',
          },
          requestedAt: '2024-01-18T16:45:00Z',
          processedAt: '2024-01-19T11:30:00Z',
        },
        {
          id: '4',
          userId: '4',
          username: 'lisaanderson',
          fullName: 'Lisa Anderson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          amount: 800000,
          fee: 16000,
          netAmount: 784000,
          status: 'completed',
          bankDetails: {
            bankName: 'Bank BNI',
            accountNumber: '5566778899',
            accountHolderName: 'Lisa Anderson',
          },
          requestedAt: '2024-01-17T12:20:00Z',
          processedAt: '2024-01-18T08:00:00Z',
          completedAt: '2024-01-18T15:30:00Z',
        },
        {
          id: '5',
          userId: '5',
          username: 'rejected',
          fullName: 'Rejected User',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          amount: 500000,
          fee: 10000,
          netAmount: 490000,
          status: 'rejected',
          bankDetails: {
            bankName: 'Bank Mandiri',
            accountNumber: '9988776655',
            accountHolderName: 'Rejected User',
          },
          requestedAt: '2024-01-16T09:10:00Z',
          processedAt: '2024-01-17T13:00:00Z',
          rejectionReason: 'Insufficient verification documents',
        },
      ];

      setPayouts(mockPayouts);
      setPagination(prev => ({
        ...prev,
        total: mockPayouts.length,
        totalPages: Math.ceil(mockPayouts.length / prev.limit),
      }));
    } catch (error) {
      console.error('Error loading payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayouts = () => {
    let filtered = [...payouts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(payout =>
        payout.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payout.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payout.bankDetails.bankName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payout => payout.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof PayoutRequest];
      let bVal = b[sortBy as keyof PayoutRequest];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      return 0;
    });

    setFilteredPayouts(filtered);
  };

  const handlePayoutAction = async (payoutId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      setPayouts(prev => 
        prev.map(payout => 
          payout.id === payoutId 
            ? { 
                ...payout, 
                status: newStatus,
                processedAt: new Date().toISOString(),
                rejectionReason: action === 'reject' ? reason : undefined
              } 
            : payout
        )
      );
      
      alert(`Payout ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing payout:`, error);
      alert(`Failed to ${action} payout`);
    }
  };

  const handleProcessPayout = async (payoutId: string) => {
    try {
      setPayouts(prev => 
        prev.map(payout => 
          payout.id === payoutId 
            ? { 
                ...payout, 
                status: 'processing'
              } 
            : payout
        )
      );
      
      alert('Payout is now being processed');
    } catch (error) {
      console.error('Error processing payout:', error);
      alert('Failed to process payout');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <Check className="h-4 w-4" />;
      case 'processing':
        return <DollarSign className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalPendingAmount = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalProcessingAmount = payouts
    .filter(p => p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payout Management</h2>
        <p className="text-gray-600">Review and manage creator payout requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payouts.filter(p => p.status === 'pending').length}</div>
            <p className="text-xs text-gray-500">{formatCurrency(totalPendingAmount)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payouts.filter(p => p.status === 'processing').length}</div>
            <p className="text-xs text-gray-500">{formatCurrency(totalProcessingAmount)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payouts.filter(p => p.status === 'completed').length}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payouts.filter(p => p.status === 'rejected').length}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search payouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="requestedAt-desc">Newest First</option>
                <option value="requestedAt-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payout Requests ({filteredPayouts.length})</CardTitle>
              <CardDescription>
                Review and process creator payout requests
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading payouts...</p>
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No payout requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <img
                      src={payout.avatar}
                      alt={payout.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{payout.fullName}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                          {getStatusIcon(payout.status)}
                          <span className="ml-1">{payout.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">@{payout.username}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CreditCard className="h-4 w-4" />
                        <span>{payout.bankDetails.bankName} - {payout.bankDetails.accountNumber}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Requested: {formatDate(payout.requestedAt)}
                      </p>
                      {payout.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1">
                          Reason: {payout.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(payout.amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Fee: {formatCurrency(payout.fee)}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      Net: {formatCurrency(payout.netAmount)}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPayoutSelect?.(payout)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {payout.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handlePayoutAction(payout.id, 'approve')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const reason = prompt('Enter rejection reason:');
                              if (reason) {
                                handlePayoutAction(payout.id, 'reject', reason);
                              }
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {payout.status === 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => handleProcessPayout(payout.id)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} requests
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
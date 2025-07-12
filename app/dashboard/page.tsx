'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
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
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading: authLoading } = useAuth();
  const { getTransactions, getDonations, loading: paymentLoading } = usePayment();
  const [stats, setStats] = useState({
    balance: 0,
    totalEarnings: 0,
    totalDonations: 0,
    monthlyEarnings: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Load fresh user data to get balance, earnings, etc.
      loadUserData();
      loadRecentData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      if (result.success) {
        setStats({
          balance: result.data.balance || 0,
          totalEarnings: result.data.total_earnings || 0,
          totalDonations: result.data.total_donations || 0,
          monthlyEarnings: 0, // Calculate from transactions
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadRecentData = async () => {
    try {
      const [transactionsData, donationsData] = await Promise.all([
        getTransactions({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }),
        getDonations({ limit: 5, sortBy: 'created_at', sortOrder: 'desc' }),
      ]);
      
      setRecentTransactions(transactionsData.data.data || []);
      setRecentDonations(donationsData.data.data || []);
    } catch (error) {
      console.error('Error loading recent data:', error);
      setRecentTransactions([]);
      setRecentDonations([]);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
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
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalDonations)}</div>
            <p className="text-xs text-muted-foreground">
              Amount you've donated
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly earnings
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions you can take
            </CardDescription>
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
            <CardDescription>
              Your latest transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {transaction.type === 'donation' ? (
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'donation' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'donation' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {transaction.status}
                      </p>
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

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-6">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagement } from '@/components/admin/UserManagement';
import { PayoutManagement } from '@/components/admin/PayoutManagement';
import { Analytics } from '@/components/admin/Analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  Activity
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  pendingPayouts: number;
  activeUsers: number;
  newUsersToday: number;
  transactionVolume: number;
  platformRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'transaction' | 'payout' | 'report';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    activeUsers: 0,
    newUsersToday: 0,
    transactionVolume: 0,
    platformRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Mock data for admin dashboard
      const mockStats: AdminStats = {
        totalUsers: 2847,
        totalTransactions: 15632,
        totalRevenue: 458923000,
        pendingPayouts: 12,
        activeUsers: 1234,
        newUsersToday: 23,
        transactionVolume: 89123000,
        platformRevenue: 22946000,
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'user_signup',
          title: 'New User Registration',
          description: 'johndoe123 joined the platform',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: '2',
          type: 'transaction',
          title: 'Large Donation',
          description: 'Donation from @supporter to @creator',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          amount: 500000,
          status: 'completed',
        },
        {
          id: '3',
          type: 'payout',
          title: 'Payout Request',
          description: 'artistgirl requested payout of Rp 2,500,000',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          amount: 2500000,
          status: 'pending',
        },
        {
          id: '4',
          type: 'report',
          title: 'User Report',
          description: 'Report submitted for inappropriate content',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          status: 'pending',
        },
        {
          id: '5',
          type: 'transaction',
          title: 'Platform Fee',
          description: 'Fee collected from transaction #TX12345',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          amount: 25000,
          status: 'completed',
        },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersToday} new today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Platform: {formatCurrency(stats.platformRevenue)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Volume: {formatCurrency(stats.transactionVolume)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayouts}</div>
            <p className="text-xs text-muted-foreground">
              Require approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest platform activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'user_signup' && <UserPlus className="h-5 w-5 text-blue-500" />}
                    {activity.type === 'transaction' && <ArrowDownRight className="h-5 w-5 text-green-500" />}
                    {activity.type === 'payout' && <ArrowUpRight className="h-5 w-5 text-orange-500" />}
                    {activity.type === 'report' && <AlertCircle className="h-5 w-5 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        {formatDate(activity.timestamp)}
                      </p>
                      {activity.amount && (
                        <p className="text-xs font-medium text-gray-600">
                          {formatCurrency(activity.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                  {activity.status && (
                    <div className="flex-shrink-0">
                      {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                      {activity.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common admin tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('payouts')}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Review Payouts
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('settings')}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Platform Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return <UserManagement />;
      case 'payouts':
        return <PayoutManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <div className="p-6 text-center text-gray-600">Platform settings coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-6">
        {renderContent()}
      </div>
    </AdminLayout>
  );
}
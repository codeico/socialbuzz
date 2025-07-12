'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/utils/formatter';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Shield,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar: string | null;
  role: 'user' | 'admin' | 'super_admin';
  is_verified: boolean;
  balance: number;
  total_earnings: number;
  total_donations: number;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  newUsersToday: number;
  activeUsers: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/users/stats', {
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

  const loadUsers = useCallback(async () => {
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
      if (filterRole !== 'all') {
        params.append('role', filterRole);
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
        setError('');
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, filterRole, filterStatus]);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [loadUsers, loadStats]);

  const handleUserAction = async (userId: string, action: string, value?: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, value }),
      });

      const data = await response.json();

      if (data.success) {
        loadUsers(); // Refresh the list
      } else {
        setError(data.error || 'Action failed');
      }
    } catch (error) {
      setError('Action failed');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/users/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds: selectedUsers, action }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedUsers([]);
        loadUsers();
      } else {
        setError(data.error || 'Bulk action failed');
      }
    } catch (error) {
      setError('Bulk action failed');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
    case 'super_admin':
      return 'bg-red-100 text-red-800';
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? 'text-green-600' : 'text-yellow-600';
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="users">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">Manage all platform users and their permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-10 w-10 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-10 w-10 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-10 w-10 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newUsersToday.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-10 w-10 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-64 pl-10"
                  />
                </div>

                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                  <option value="super_admin">Super Admins</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  <Button onClick={() => handleBulkAction('verify')} variant="outline" size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Selected
                  </Button>
                  <Button onClick={() => handleBulkAction('unverify')} variant="outline" size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Unverify Selected
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

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({pagination.total})</CardTitle>
            <CardDescription>
              Showing {users.length} of {pagination.total} users
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
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedUsers(users.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="p-4 text-left font-medium text-gray-900">User</th>
                    <th className="p-4 text-left font-medium text-gray-900">Role</th>
                    <th className="p-4 text-left font-medium text-gray-900">Status</th>
                    <th className="p-4 text-left font-medium text-gray-900">Balance</th>
                    <th className="p-4 text-left font-medium text-gray-900">Last Login</th>
                    <th className="p-4 text-left font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={user.avatar || '/default-avatar.png'}
                            alt={user.full_name}
                            className="mr-3 h-10 w-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleColor(user.role)}`}
                        >
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          {user.is_verified ? (
                            <CheckCircle className={`mr-1 h-4 w-4 ${getStatusColor(true)}`} />
                          ) : (
                            <XCircle className={`mr-1 h-4 w-4 ${getStatusColor(false)}`} />
                          )}
                          <span className={getStatusColor(user.is_verified)}>
                            {user.is_verified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium">{formatCurrency(user.balance)}</p>
                          <p className="text-gray-500">Earned: {formatCurrency(user.total_earnings)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {user.last_login ? (
                            <>
                              <p>{formatDate(user.last_login)}</p>
                              <p className="text-gray-500">{new Date(user.last_login).toLocaleTimeString()}</p>
                            </>
                          ) : (
                            <span className="text-gray-500">Never</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/profile/${user.username}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'toggle_verification')}
                          >
                            {user.is_verified ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
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
      </div>
    </AdminLayout>
  );
}

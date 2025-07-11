'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { 
  Search, 
  Filter, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal, 
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  totalEarnings: number;
  totalDonations: number;
  createdAt: string;
  lastLogin: string;
  isVerified: boolean;
}

interface UserManagementProps {
  onUserSelect?: (user: User) => void;
}

export function UserManagement({ onUserSelect }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.page, sortBy, sortOrder]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Mock users data
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'johndoe',
          email: 'john@example.com',
          fullName: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'user',
          status: 'active',
          totalEarnings: 1250000,
          totalDonations: 450000,
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-01-20T14:22:00Z',
          isVerified: true,
        },
        {
          id: '2',
          username: 'sarahsmith',
          email: 'sarah@example.com',
          fullName: 'Sarah Smith',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          role: 'user',
          status: 'active',
          totalEarnings: 850000,
          totalDonations: 200000,
          createdAt: '2024-01-10T08:15:00Z',
          lastLogin: '2024-01-19T16:45:00Z',
          isVerified: false,
        },
        {
          id: '3',
          username: 'mikejohnson',
          email: 'mike@example.com',
          fullName: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: 'user',
          status: 'suspended',
          totalEarnings: 2100000,
          totalDonations: 100000,
          createdAt: '2024-01-05T12:00:00Z',
          lastLogin: '2024-01-18T09:30:00Z',
          isVerified: true,
        },
        {
          id: '4',
          username: 'alexadmin',
          email: 'alex@example.com',
          fullName: 'Alex Admin',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          role: 'admin',
          status: 'active',
          totalEarnings: 0,
          totalDonations: 0,
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: '2024-01-20T10:00:00Z',
          isVerified: true,
        },
        {
          id: '5',
          username: 'banneduser',
          email: 'banned@example.com',
          fullName: 'Banned User',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          role: 'user',
          status: 'banned',
          totalEarnings: 0,
          totalDonations: 0,
          createdAt: '2024-01-12T15:30:00Z',
          lastLogin: '2024-01-15T11:20:00Z',
          isVerified: false,
        },
      ];

      setUsers(mockUsers);
      setPagination(prev => ({
        ...prev,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / prev.limit),
      }));
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof User];
      const bVal = b[sortBy as keyof User];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      return 0;
    });

    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    try {
      // Mock API call
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      // Show success message
      alert(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      // Mock API call
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, isVerified: true } : user
        )
      );
      
      alert('User verified successfully');
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to verify user');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage platform users and their accounts</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
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
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
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
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="fullName-asc">Name A-Z</option>
                <option value="fullName-desc">Name Z-A</option>
                <option value="totalEarnings-desc">Highest Earnings</option>
                <option value="totalEarnings-asc">Lowest Earnings</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        {user.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Earnings: {formatCurrency(user.totalEarnings)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Donations: {formatCurrency(user.totalDonations)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined: {formatDate(user.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last login: {formatDate(user.lastLogin)}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUserSelect?.(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {!user.isVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyUser(user.id)}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {user.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {user.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {user.status !== 'banned' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(user.id, 'banned')}
                        >
                          <Ban className="h-4 w-4" />
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
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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
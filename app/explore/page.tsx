'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/utils/formatter';
import { 
  Search, 
  Filter, 
  Star, 
  Heart, 
  Users, 
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  category: string;
  isVerified: boolean;
  stats: {
    totalDonations: number;
    totalSupporters: number;
    avgDonationAmount: number;
    lastDonationAt?: string;
  };
  socialLinks: Record<string, string>;
  joinedAt: string;
}

export default function ExplorePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'art', name: 'Art & Design' },
    { id: 'music', name: 'Music' },
    { id: 'tech', name: 'Technology' },
    { id: 'education', name: 'Education' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'business', name: 'Business' },
    { id: 'other', name: 'Other' },
  ];

  useEffect(() => {
    loadCreators();
  }, [selectedCategory, sortBy, pagination.page]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== '') {
        loadCreators();
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const loadCreators = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/v1/creators?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCreators(data.data);
        setPagination(data.pagination);
        setError('');
      } else {
        setError('Failed to load creators');
      }
    } catch (error) {
      setError('Failed to load creators');
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading creators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading creators</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadCreators()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                SocialBuzz
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button>
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Discover Amazing Creators
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find and support talented creators from around the world.
              Every contribution helps them continue doing what they love.
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search size={20} className="mr-2" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="earnings">Top Earners</option>
                    <option value="name">Alphabetical</option>
                    <option value="recent">Recently Joined</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {pagination.total} Creator{pagination.total !== 1 ? 's' : ''} Found
              </h2>
              <div className="text-sm text-gray-600">
                Showing {creators.length} of {pagination.total} creators
              </div>
            </div>

            {creators.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-500">
                    <Search size={48} className="mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No creators found</h3>
                    <p>Try adjusting your search terms or filters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map(creator => (
                  <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="relative inline-block">
                        <img
                          src={creator.avatar}
                          alt={creator.displayName}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                        {creator.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                            <Star size={12} />
                          </div>
                        )}
                      </div>
                      <CardTitle className="mt-4">{creator.displayName}</CardTitle>
                      <CardDescription>@{creator.username}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {creator.bio}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Users size={16} className="mr-1" />
                            {creator.stats.totalSupporters} supporters
                          </div>
                          <div className="flex items-center text-gray-500">
                            <TrendingUp size={16} className="mr-1" />
                            {formatCurrency(creator.stats.totalDonations)}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 capitalize">
                          {categories.find(cat => cat.id === creator.category)?.name}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link 
                          href={`/profile/${creator.username}`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                        <Link 
                          href={`/profile/${creator.username}`}
                          className="flex-1"
                        >
                          <Button className="w-full">
                            <Heart size={16} className="mr-2" />
                            Support
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
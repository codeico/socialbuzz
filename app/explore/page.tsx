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
  fullName: string;
  avatar: string;
  bio: string;
  totalEarnings: number;
  supporterCount: number;
  isVerified: boolean;
  category: string;
}

export default function ExplorePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    filterAndSortCreators();
  }, [creators, searchQuery, selectedCategory, sortBy]);

  const loadCreators = async () => {
    try {
      // Mock data - in real app, this would be an API call
      const mockCreators: Creator[] = [
        {
          id: '1',
          username: 'johndoe',
          fullName: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Content creator passionate about technology and education',
          totalEarnings: 1250000,
          supporterCount: 42,
          isVerified: true,
          category: 'tech',
        },
        {
          id: '2',
          username: 'artlover',
          fullName: 'Sarah Wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          bio: 'Digital artist creating amazing illustrations',
          totalEarnings: 850000,
          supporterCount: 28,
          isVerified: false,
          category: 'art',
        },
        {
          id: '3',
          username: 'musicmaker',
          fullName: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          bio: 'Musician and producer sharing my musical journey',
          totalEarnings: 2100000,
          supporterCount: 89,
          isVerified: true,
          category: 'music',
        },
        {
          id: '4',
          username: 'gamerpro',
          fullName: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          bio: 'Professional gamer and streaming content',
          totalEarnings: 1800000,
          supporterCount: 156,
          isVerified: true,
          category: 'gaming',
        },
        {
          id: '5',
          username: 'educator',
          fullName: 'Lisa Anderson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          bio: 'Teaching programming and web development',
          totalEarnings: 950000,
          supporterCount: 67,
          isVerified: false,
          category: 'education',
        },
        {
          id: '6',
          username: 'lifestyle',
          fullName: 'Emma Davis',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          bio: 'Lifestyle blogger sharing daily inspirations',
          totalEarnings: 720000,
          supporterCount: 34,
          isVerified: false,
          category: 'lifestyle',
        },
      ];
      
      setCreators(mockCreators);
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCreators = () => {
    let filtered = creators;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(creator =>
        creator.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(creator => creator.category === selectedCategory);
    }

    // Sort creators
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.supporterCount - a.supporterCount);
        break;
      case 'earnings':
        filtered.sort((a, b) => b.totalEarnings - a.totalEarnings);
        break;
      case 'name':
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'recent':
        // In real app, this would sort by creation date
        filtered.sort((a, b) => Math.random() - 0.5);
        break;
      default:
        break;
    }

    setFilteredCreators(filtered);
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
                {filteredCreators.length} Creator{filteredCreators.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredCreators.length} of {creators.length} creators
              </div>
            </div>

            {filteredCreators.length === 0 ? (
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
                {filteredCreators.map(creator => (
                  <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="relative inline-block">
                        <img
                          src={creator.avatar}
                          alt={creator.fullName}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                        {creator.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                            <Star size={12} />
                          </div>
                        )}
                      </div>
                      <CardTitle className="mt-4">{creator.fullName}</CardTitle>
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
                            {creator.supporterCount} supporters
                          </div>
                          <div className="flex items-center text-gray-500">
                            <TrendingUp size={16} className="mr-1" />
                            {formatCurrency(creator.totalEarnings)}
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
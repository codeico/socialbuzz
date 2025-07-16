'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/utils/formatter';
import Image from 'next/image';
import { Heart, Share2, MapPin, Link as LinkIcon, Calendar, Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { categorizePaymentMethods } from '@/utils/paymentMethods';
import { usePaymentSettings, usePlatformSettings } from '@/hooks/useSystemSettings';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  isOnboarded: boolean;
  role: string;
  location: string;
  website: string;
  profile: {
    bio: string;
    category: string;
    social_links: Record<string, string>;
    bank_account: Record<string, string>;
  } | null;
  stats: {
    total_donations: number;
    total_supporters: number;
    avg_donation_amount: number;
    last_donation_at: string | null;
  };
  joinedAt: string;
}

interface PaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

interface DonationFormData {
  amount: string;
  message: string;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  hideEmail: boolean;
  agreeToTerms: boolean;
  confirmAge: boolean;
  selectedPaymentMethod: string;
}

interface RecentDonation {
  id: string;
  amount: number;
  message: string;
  isAnonymous: boolean;
  supporterName: string;
  supporterEmail: string | null;
  createdAt: string;
}

interface TopSupporter {
  supporterName: string;
  totalAmount: number;
  donationCount: number;
  isAnonymous: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationModal, setDonationModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [topSupporters, setTopSupporters] = useState<TopSupporter[]>([]);
  const [loadingTopSupporters, setLoadingTopSupporters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationError, setDonationError] = useState('');
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    amount: '',
    message: '',
    donorName: '',
    donorEmail: '',
    isAnonymous: false,
    hideEmail: false,
    agreeToTerms: false,
    confirmAge: false,
    selectedPaymentMethod: '',
  });

  // Use dynamic payment settings from database
  const { minDonation, maxDonation, predefinedAmounts: configuredAmounts, loading: paymentLoading } = usePaymentSettings();
  const { platformName } = usePlatformSettings();

  // Use predefined amounts from admin settings, with fallback to generated amounts
  const predefinedAmounts = React.useMemo(() => {
    if (paymentLoading) return [10000, 25000, 50000, 100000, 250000, 500000];
    
    // Use configured amounts from admin settings if available
    if (configuredAmounts && configuredAmounts.length > 0) {
      return configuredAmounts.filter(amount => amount >= minDonation && amount <= maxDonation);
    }
    
    // Fallback: Generate amounts based on min/max
    const min = minDonation;
    const max = maxDonation;
    
    const amounts = [];
    const step = (max - min) / 6;
    
    for (let i = 1; i <= 6; i++) {
      const amount = Math.round((min + (step * i)) / 1000) * 1000; // Round to nearest 1000
      amounts.push(amount);
    }
    
    return amounts;
  }, [minDonation, maxDonation, configuredAmounts, paymentLoading]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/v1/users/username/${username}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setError('');
      } else {
        setError(data.error || 'User not found');
      }
    } catch (error) {
      setError('Failed to load profile');
      // console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const loadRecentDonations = useCallback(async (userId: string) => {
    try {
      setLoadingDonations(true);
      const response = await fetch(`/api/v1/users/${userId}/donations?limit=5`);
      const data = await response.json();

      if (data.success) {
        setRecentDonations(data.data);
      } else {
        console.error('Failed to load recent donations:', data.error);
        setRecentDonations([]);
      }
    } catch (error) {
      console.error('Error loading recent donations:', error);
      setRecentDonations([]);
    } finally {
      setLoadingDonations(false);
    }
  }, []);

  const loadTopSupporters = useCallback(async (userId: string) => {
    try {
      setLoadingTopSupporters(true);
      const response = await fetch(`/api/v1/users/${userId}/donations?limit=1000`);
      const data = await response.json();

      if (data.success) {
        // Group donations by supporter name and calculate totals
        const supporterTotals = new Map<string, TopSupporter>();
        
        data.data.forEach((donation: RecentDonation) => {
          const key = donation.supporterName;
          if (supporterTotals.has(key)) {
            const existing = supporterTotals.get(key)!;
            existing.totalAmount += donation.amount;
            existing.donationCount += 1;
          } else {
            supporterTotals.set(key, {
              supporterName: donation.supporterName,
              totalAmount: donation.amount,
              donationCount: 1,
              isAnonymous: donation.isAnonymous
            });
          }
        });

        // Convert to array and sort by total amount (descending)
        const sortedSupporters = Array.from(supporterTotals.values())
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 10); // Top 10 supporters

        setTopSupporters(sortedSupporters);
      } else {
        console.error('Failed to load top supporters:', data.error);
        setTopSupporters([]);
      }
    } catch (error) {
      console.error('Error loading top supporters:', error);
      setTopSupporters([]);
    } finally {
      setLoadingTopSupporters(false);
    }
  }, []);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username, loadProfile]);

  useEffect(() => {
    if (profile?.id) {
      loadRecentDonations(profile.id);
      loadTopSupporters(profile.id);
    }
  }, [profile?.id, loadRecentDonations, loadTopSupporters]);

  const loadPaymentMethods = useCallback(async (amount: number) => {
    if (amount < minDonation) {
      setPaymentMethods([]);
      return;
    }

    setLoadingPaymentMethods(true);
    try {
      const response = await fetch('/api/v1/payments/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const result = await response.json();
      
      if (result.success) {
        setPaymentMethods(result.data.paymentMethods);
        
        // Categorize methods and expand first category by default
        const categorizedMethods = categorizePaymentMethods(result.data.paymentMethods);
        if (categorizedMethods.length > 0) {
          setExpandedCategories(new Set([categorizedMethods[0].id]));
          
          // Auto-select first payment method
          if (categorizedMethods[0].methods.length > 0) {
            setDonationForm(prev => ({ 
              ...prev, 
              selectedPaymentMethod: categorizedMethods[0].methods[0].paymentMethod 
            }));
          }
        }
      } else {
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setPaymentMethods([]);
    } finally {
      setLoadingPaymentMethods(false);
    }
  }, [minDonation]);

  const handleAmountSelect = (amount: number) => {
    setDonationForm(prev => ({ ...prev, amount: amount.toString() }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleInputChange = (field: keyof DonationFormData, value: string | boolean) => {
    setDonationForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // If anonymous checkbox is toggled
      if (field === 'isAnonymous' && typeof value === 'boolean') {
        if (value) {
          // Set name to Someone when checked
          updated.donorName = 'Someone';
        } else {
          // Clear name when unchecked
          updated.donorName = '';
        }
      }
      
      return updated;
    });
    
  };

  const handleDonation = async () => {
    if (!profile) return;

    setIsSubmitting(true);
    setDonationError('');

    try {
      const amount = parseFloat(donationForm.amount);
      
      // Validation
      if (isNaN(amount) || amount < minDonation) {
        setDonationError(`Minimum donation amount is ${formatCurrency(minDonation)}`);
        setIsSubmitting(false);
        return;
      }
      
      if (amount > maxDonation) {
        setDonationError(`Maximum donation amount is ${formatCurrency(maxDonation)}`);
        setIsSubmitting(false);
        return;
      }
      
      if (!donationForm.donorName.trim()) {
        setDonationError('Donor name is required');
        setIsSubmitting(false);
        return;
      }

      if (!donationForm.donorEmail.trim()) {
        setDonationError('Email is required');
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(donationForm.donorEmail)) {
        setDonationError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      if (!donationForm.agreeToTerms) {
        setDonationError('You must agree to the terms and conditions');
        setIsSubmitting(false);
        return;
      }

      if (!donationForm.confirmAge) {
        setDonationError('You must confirm that you are 18 years of age or older');
        setIsSubmitting(false);
        return;
      }

      // Create donation record like widget page does
      const response = await fetch('/api/v1/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: profile.id,
          amount: amount,
          message: donationForm.message.trim(),
          donor_name: donationForm.donorName.trim(),
          donor_email: donationForm.donorEmail.trim(),
          is_anonymous: donationForm.isAnonymous,
          hide_email: donationForm.hideEmail,
          agree_to_terms: donationForm.agreeToTerms,
          confirm_age: donationForm.confirmAge,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payment detail page like widget does
        window.location.href = `/payment/${result.data.id}`;
      } else {
        setDonationError(result.error || 'Failed to create donation');
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      setDonationError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Support ${profile?.displayName} on SocialBuzz`,
          text: `Check out ${profile?.displayName}'s profile and show your support!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadProfile()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <p className="text-gray-600">The user @{username} does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={profile.avatar || '/default-avatar.png'}
                alt={profile.displayName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
                <p className="text-gray-600">@{profile.username}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Joined {formatDate(profile.joinedAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleShare}>
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button onClick={() => setDonationModal(true)}>
                <Heart size={16} className="mr-2" />
                Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {profile.profile?.bio || 'This user hasn\'t added a bio yet.'}
                </p>

                {profile.website && (
                  <div className="mt-4">
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                    >
                      <LinkIcon size={16} className="mr-2" />
                      {profile.website}
                    </a>
                  </div>
                )}

                {profile.profile?.social_links && Object.keys(profile.profile.social_links).length > 0 && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(profile.profile.social_links)
                      .filter(([platform, url]) => url)
                      .map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mr-4"
                        >
                          <LinkIcon size={16} className="mr-2" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Supporters */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Supporters</CardTitle>
                <CardDescription>People who have recently supported this creator</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDonations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Loading recent supporters...</span>
                  </div>
                ) : recentDonations.length > 0 ? (
                  <div className="space-y-4">
                    {recentDonations.map((donation, index) => {
                      const initials = donation.isAnonymous 
                        ? 'A' 
                        : donation.supporterName.split(' ').map(n => n[0]).join('').toUpperCase();
                      const gradientColors = [
                        'from-blue-500 to-purple-600',
                        'from-green-500 to-teal-600', 
                        'from-pink-500 to-rose-600',
                        'from-orange-500 to-red-600',
                        'from-indigo-500 to-blue-600'
                      ];
                      const gradientClass = gradientColors[index % gradientColors.length];
                      
                      return (
                        <div key={donation.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center text-white font-semibold`}>
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium">
                                {donation.isAnonymous ? 'Anonymous' : donation.supporterName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(donation.createdAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">{formatCurrency(donation.amount)}</p>
                            {donation.message && (
                              <p className="text-sm text-gray-500 max-w-32 truncate" title={donation.message}>
                                {donation.message}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No supporters yet</p>
                    <p className="text-sm text-gray-400">Be the first to show your support!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Supporters */}
            <Card>
              <CardHeader>
                <CardTitle>Top Supporters</CardTitle>
                <CardDescription>The most generous supporters of this creator</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTopSupporters ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Loading top supporters...</span>
                  </div>
                ) : topSupporters.length > 0 ? (
                  <div className="space-y-4">
                    {topSupporters.map((supporter, index) => {
                      const initials = supporter.isAnonymous 
                        ? 'A' 
                        : supporter.supporterName.split(' ').map(n => n[0]).join('').toUpperCase();
                      const gradientColors = [
                        'from-yellow-500 to-orange-600', // Gold for #1
                        'from-gray-400 to-gray-600',     // Silver for #2
                        'from-yellow-600 to-yellow-800', // Bronze for #3
                        'from-blue-500 to-purple-600',
                        'from-green-500 to-teal-600', 
                        'from-pink-500 to-rose-600',
                        'from-orange-500 to-red-600',
                        'from-indigo-500 to-blue-600',
                        'from-purple-500 to-pink-600',
                        'from-teal-500 to-cyan-600'
                      ];
                      const gradientClass = gradientColors[index % gradientColors.length];
                      
                      return (
                        <div key={supporter.supporterName} className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center text-white font-semibold`}>
                              {initials}
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                                {index === 0 && <span className="text-xs">🥇</span>}
                                {index === 1 && <span className="text-xs">🥈</span>}
                                {index === 2 && <span className="text-xs">🥉</span>}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {supporter.isAnonymous ? 'Anonymous' : supporter.supporterName}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No top supporters yet</p>
                    <p className="text-sm text-gray-400">Be the first to show your support!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users size={20} className="mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Supporters</span>
                    </div>
                    <span className="font-semibold">{profile.stats.total_supporters}</span>
                  </div>
                  
                  {profile.stats.last_donation_at && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar size={20} className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">Last Support</span>
                      </div>
                      <span className="font-semibold text-xs">{formatDate(profile.stats.last_donation_at)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Support Button */}
            <Card>
              <CardHeader>
                <CardTitle>Support {profile.displayName}</CardTitle>
                <CardDescription>Show your appreciation with a donation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setDonationModal(true)} className="w-full" size="lg">
                  <Heart size={20} className="mr-2" />
                  Send Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <Modal isOpen={donationModal} onClose={() => setDonationModal(false)} title="Support this Creator" size="lg">
        <div className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Amount</label>
            <div className="flex items-center border border-gray-300 rounded-md mb-3">
              <div className="flex items-center px-3 py-2 border-r border-gray-300 bg-gray-50">
                <span className="text-sm font-medium text-gray-700">IDR</span>
              </div>
              <input
                type="text"
                value={donationForm.amount ? parseFloat(donationForm.amount).toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  handleInputChange('amount', value);
                }}
                placeholder="10,000"
                className="flex-1 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {predefinedAmounts.slice(0, 6).map(amount => (
                <Button
                  key={amount}
                  variant={donationForm.amount === amount.toString() ? 'primary' : 'outline'}
                  onClick={() => handleAmountSelect(amount)}
                  className="text-sm py-2"
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>


          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Write your message (Optional)</label>
            <textarea
              placeholder="Say something nice to the creator..."
              value={donationForm.message}
              onChange={e => handleInputChange('message', e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              maxLength={100}
            />
            <div className="flex justify-end mt-1">
              <p className="text-xs text-gray-500">{donationForm.message.length}/100 characters</p>
            </div>
          </div>

          {/* Donor Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={donationForm.donorName}
              onChange={e => handleInputChange('donorName', e.target.value)}
              disabled={donationForm.isAnonymous}
              className={donationForm.isAnonymous ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
              fullWidth
            />

            <div className="flex items-center space-x-2 mt-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={donationForm.isAnonymous}
                onChange={e => handleInputChange('isAnonymous', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">
                Anonymous
              </label>
            </div>
          </div>

          {/* Donor Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={donationForm.donorEmail}
              onChange={e => handleInputChange('donorEmail', e.target.value)}
              fullWidth
            />

            <div className="flex items-center space-x-2 mt-3">
              <input
                type="checkbox"
                id="hideEmail"
                checked={donationForm.hideEmail}
                onChange={e => handleInputChange('hideEmail', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="hideEmail" className="text-sm text-gray-700 cursor-pointer">
                Hide my email from {profile?.displayName || 'recipient'}
              </label>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={donationForm.agreeToTerms}
                onChange={e => handleInputChange('agreeToTerms', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5 flex-shrink-0"
              />
              <label htmlFor="agreeToTerms" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
                I hereby declare this transaction is: purely my support for{' '}
                <span className="font-semibold">{profile?.displayName || 'this creator'}</span>, 
                non-refundable, not for a commercial transaction, not for any illegal activity, 
                not violating the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                  terms of {platformName || 'SITENAME'}
                </a>
              </label>
            </div>
          </div>

          {/* Age Confirmation */}
          <div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="confirmAge"
                checked={donationForm.confirmAge}
                onChange={e => handleInputChange('confirmAge', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
              />
              <label htmlFor="confirmAge" className="text-xs text-gray-700 cursor-pointer">
                I am 18 years of age or older
              </label>
            </div>
          </div>

          {/* Error Message */}
          {donationError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{donationError}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={() => setDonationModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleDonation}
              disabled={
                !donationForm.amount || 
                parseFloat(donationForm.amount) < minDonation ||
                !donationForm.donorName.trim() ||
                !donationForm.donorEmail.trim() ||
                !donationForm.agreeToTerms ||
                !donationForm.confirmAge ||
                isSubmitting
              }
              className={`flex-1 ${
                isSubmitting || !donationForm.agreeToTerms || !donationForm.confirmAge
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Send Support
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

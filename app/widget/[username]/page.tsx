'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatter';
import { io, Socket } from 'socket.io-client';
import { DonationNotification } from '@/lib/websocket';
import { Heart, Users, TrendingUp, Gift, MessageCircle, Send } from 'lucide-react';
import { usePaymentSettings, usePlatformSettings } from '@/hooks/useSystemSettings';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  profile?: {
    bio: string;
  };
  stats: {
    total_donations: number;
    total_supporters: number;
  };
  isVerified: boolean;
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
}

export default function DonationWidget() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [recentDonations, setRecentDonations] = useState<DonationNotification[]>([]);
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    amount: '',
    message: '',
    donorName: '',
    donorEmail: '',
    isAnonymous: false,
    hideEmail: false,
    agreeToTerms: false,
    confirmAge: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

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

  const loadCreatorData = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/users/username/${username}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        throw new Error('Failed to fetch creator data');
      }

      const result = await response.json();
      
      if (result.success) {
        setCreator(result.data);
        
        // Load recent donations
        try {
          const donationsResponse = await fetch(`/api/v1/donations/recent/${result.data.id}`);
          if (donationsResponse.ok) {
            const donationsResult = await donationsResponse.json();
            if (donationsResult.success) {
              setRecentDonations(donationsResult.data);
            }
          }
        } catch (error) {
          console.error('Error loading recent donations:', error);
        }
      } else {
        throw new Error(result.error || 'Failed to load creator');
      }
    } catch (error) {
      console.error('Error loading creator:', error);
      setNotFound(true);
    }
  }, [username]);

  const initializeWebSocket = useCallback(() => {
    if (!creator) return () => {};

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('join-donation-widget', {
        creatorId: creator.id,
        widgetId: `widget-${Date.now()}`,
      });
    });

    newSocket.on('widget-connected', data => {
      console.log('Widget connected:', data);
    });

    newSocket.on('donation-alert', (donation: DonationNotification) => {
      console.log('New donation received:', donation);
      setRecentDonations(prev => [donation, ...prev.slice(0, 4)]);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [creator]);

  useEffect(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  useEffect(() => {
    if (creator) {
      return initializeWebSocket();
    }
  }, [creator, initializeWebSocket]);

  const handleAmountSelect = (amount: number) => {
    setDonationForm(prev => ({ ...prev, amount: amount.toString() }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creator) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const amount = parseFloat(donationForm.amount);
      
      // Validation
      if (isNaN(amount) || amount < minDonation) {
        setError(`Minimum donation amount is ${formatCurrency(minDonation)}`);
        setIsSubmitting(false);
        return;
      }
      
      if (amount > maxDonation) {
        setError(`Maximum donation amount is ${formatCurrency(maxDonation)}`);
        setIsSubmitting(false);
        return;
      }
      
      if (!donationForm.donorName.trim()) {
        setError('Donor name is required');
        setIsSubmitting(false);
        return;
      }

      if (!donationForm.donorEmail.trim()) {
        setError('Email is required');
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(donationForm.donorEmail)) {
        setError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      if (!donationForm.agreeToTerms) {
        setError('You must agree to the terms and conditions');
        setIsSubmitting(false);
        return;
      }

      if (!donationForm.confirmAge) {
        setError('You must confirm that you are 18 years of age or older');
        setIsSubmitting(false);
        return;
      }

      // Create donation record
      const response = await fetch('/api/v1/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: creator.id,
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
        // Redirect to payment detail page
        router.push(`/payment/${result.data.id}`);
      } else {
        setError(result.error || 'Failed to create donation');
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Creator Not Found</h2>
            <p className="text-gray-600 mb-4">
              The creator you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading creator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Creator Profile Header */}
        <div className="text-center py-8 bg-white">
          <div className="relative inline-block mb-4">
            <Image
              src={creator.avatar || '/default-avatar.png'}
              alt={creator.displayName}
              width={100}
              height={100}
              className="w-25 h-25 rounded-full mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center justify-center">
            {creator.displayName}
            {creator.isVerified && (
              <svg className="w-6 h-6 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#0095f6"/>
              </svg>
            )}
          </h1>
          {creator.profile?.bio && (
            <p className="text-sm text-gray-500 mb-3 px-4">{creator.profile.bio}</p>
          )}
          <div className="flex justify-center items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{creator.stats.total_supporters} supporters</span>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-white rounded-t-3xl shadow-sm p-6 mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Selection */}
            <div>
              <p className="font-bold text-base mb-3">
                Amount to be given
              </p>
              <div className="flex items-center border border-gray-300 rounded-md mb-3">
                <div className="flex items-center px-3 py-2 border-r border-gray-300 bg-gray-50">
                  <span className="text-sm font-bold text-gray-700">IDR</span>
                  <i className="fas fa-chevron-down ml-2 text-xs text-gray-500"></i>
                </div>
                <input
                  type="text"
                  value={donationForm.amount ? parseFloat(donationForm.amount).toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    handleInputChange('amount', value);
                  }}
                  placeholder="10,000"
                  className="flex-1 px-3 py-2 outline-none"
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[10000, 25000, 50000, 100000, 200000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`px-4 py-2 rounded-full border font-bold text-sm ${
                      donationForm.amount === amount.toString() 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {amount.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="font-bold text-base mb-3">
                Write your message
              </p>
              <textarea
                value={donationForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Write your message here..."
                rows={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={100}
                style={{ minHeight: '38px' }}
              />
              <div className="flex justify-end mt-2">
                <p className="text-xs text-gray-500">
                  {donationForm.message.length} / 100
                </p>
              </div>
            </div>

            {/* Donor Name */}
            <div>
              <label className="block font-bold text-base mb-3">
                Your name
              </label>
              <Input
                type="text"
                value={donationForm.donorName}
                onChange={(e) => handleInputChange('donorName', e.target.value)}
                placeholder="Enter your name"
                disabled={donationForm.isAnonymous}
                maxLength={100}
                className={`w-full ${donationForm.isAnonymous ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
              />
              
              {/* Anonymous Option */}
              <label className="flex items-center mt-3 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={donationForm.isAnonymous}
                  onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                />
                <span className="text-gray-700">Anonymous</span>
              </label>
            </div>

            {/* Donor Email */}
            <div>
              <label className="block font-bold text-base mb-3">
                Your email
              </label>
              <Input
                type="email"
                value={donationForm.donorEmail}
                onChange={(e) => handleInputChange('donorEmail', e.target.value)}
                placeholder="Enter your email"
                maxLength={100}
                className="w-full"
              />
              
              {/* Hide Email Option */}
              <label className="flex items-center mt-3 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={donationForm.hideEmail}
                  onChange={(e) => handleInputChange('hideEmail', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                />
                <span className="text-gray-700">Hide my email from {creator?.displayName || 'recipient'}</span>
              </label>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div>
              <label className="flex items-start space-x-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={donationForm.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-700 leading-relaxed">
                  I hereby declare this transaction is: purely my support for{' '}
                  <span className="font-semibold">{creator?.displayName || 'this creator'}</span>, 
                  non-refundable, not for a commercial transaction, not for any illegal activity, 
                  not violating the{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    terms of {platformName || 'SITENAME'}
                  </a>
                </span>
              </label>
            </div>

            {/* Age Confirmation Checkbox */}
            <div>
              <label className="flex items-center space-x-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={donationForm.confirmAge}
                  onChange={(e) => handleInputChange('confirmAge', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                />
                <span className="text-gray-700">
                  I am 18 years of age or older
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !donationForm.agreeToTerms || !donationForm.confirmAge}
              className={`w-full py-3 text-lg font-semibold rounded-md ${
                isSubmitting || !donationForm.agreeToTerms || !donationForm.confirmAge
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Send Support
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Recent Donations */}
        {recentDonations.length > 0 && (
          <div className="bg-white mt-4 p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-base mb-3">
              Recent Support
            </h3>
            <div className="space-y-3">
              {recentDonations.slice(0, 3).map((donation, index) => (
                <div key={donation.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-sm text-gray-900">
                      {donation.donorName}
                    </span>
                    {donation.message && (
                      <p className="text-xs text-gray-600 mt-1">
                        &quot;{donation.message}&quot;
                      </p>
                    )}
                  </div>
                  <span className="text-blue-600 font-bold text-sm ml-3">
                    IDR {donation.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
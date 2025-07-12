'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatter';
import { io, Socket } from 'socket.io-client';
import { DonationNotification } from '@/lib/websocket';
import { Heart, Users, TrendingUp, Gift, MessageCircle } from 'lucide-react';

interface Creator {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  totalEarnings: number;
  supporterCount: number;
  isVerified: boolean;
}

interface DonationFormData {
  amount: string;
  message: string;
  donorName: string;
  isAnonymous: boolean;
}

export default function DonationWidget() {
  const params = useParams();
  const creatorId = params.creatorId as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [recentDonations, setRecentDonations] = useState<DonationNotification[]>([]);
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    amount: '',
    message: '',
    donorName: '',
    isAnonymous: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const predefinedAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const loadCreatorData = useCallback(async () => {
    try {
      // Mock creator data - in real app, fetch from API
      const mockCreator: Creator = {
        id: creatorId,
        username: 'johndoe',
        fullName: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Content creator passionate about technology and education',
        totalEarnings: 1250000,
        supporterCount: 42,
        isVerified: true,
      };
      setCreator(mockCreator);
    } catch (error) {
      console.error('Error loading creator:', error);
    }
  }, [creatorId]);

  const initializeWebSocket = useCallback(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('join-donation-widget', {
        creatorId,
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
  }, [creatorId]);

  useEffect(() => {
    loadCreatorData();
    initializeWebSocket();
  }, [loadCreatorData, initializeWebSocket]);

  const handleAmountSelect = (amount: number) => {
    setDonationForm(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleInputChange = (field: keyof DonationFormData, value: string | boolean) => {
    setDonationForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDonate = async () => {
    if (!donationForm.amount || parseFloat(donationForm.amount) < 5000) {
      alert('Minimum donation amount is Rp 5,000');
      return;
    }

    setIsLoading(true);

    try {
      // Create payment request
      const response = await fetch('/api/v1/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: creatorId,
          amount: parseFloat(donationForm.amount),
          message: donationForm.message,
          donorName: donationForm.isAnonymous ? 'Anonymous' : donationForm.donorName,
          isAnonymous: donationForm.isAnonymous,
          type: 'donation',
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payment page
        window.open(result.data.paymentUrl, '_blank');
        setShowSuccess(true);

        // Reset form
        setDonationForm({
          amount: '',
          message: '',
          donorName: '',
          isAnonymous: false,
        });

        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert('Failed to create payment: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Failed to process donation');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Creator Profile */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-20"></div>
          <CardContent className="relative pt-0">
            <div className="flex items-start space-x-4 -mt-10">
              <Image
                src={creator.avatar}
                alt={creator.fullName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex-1 pt-12">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-gray-900">{creator.fullName}</h1>
                  {creator.isVerified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">@{creator.username}</p>
                <p className="text-sm text-gray-500 mt-2">{creator.bio}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-green-600">
                  <TrendingUp size={16} />
                  <span className="font-bold">{formatCurrency(creator.totalEarnings)}</span>
                </div>
                <p className="text-xs text-gray-500">Total Earnings</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-blue-600">
                  <Users size={16} />
                  <span className="font-bold">{creator.supporterCount}</span>
                </div>
                <p className="text-xs text-gray-500">Supporters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {showSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Thank you for your donation! 🎉</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your payment is being processed. The creator will be notified once it&apos;s completed.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Donation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              Support {creator.fullName}
            </CardTitle>
            <CardDescription>Show your appreciation with a donation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Amount</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {predefinedAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant={donationForm.amount === amount.toString() ? 'primary' : 'outline'}
                    onClick={() => handleAmountSelect(amount)}
                    className="text-sm"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
              <Input
                placeholder="Custom amount (min Rp 5,000)"
                value={donationForm.amount}
                onChange={e => handleInputChange('amount', e.target.value)}
                type="number"
                min="5000"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                placeholder="Say something nice to the creator..."
                value={donationForm.message}
                onChange={e => handleInputChange('message', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{donationForm.message.length}/200 characters</p>
            </div>

            {/* Donor Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={donationForm.donorName}
                onChange={e => handleInputChange('donorName', e.target.value)}
                disabled={donationForm.isAnonymous}
              />

              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={donationForm.isAnonymous}
                  onChange={e => handleInputChange('isAnonymous', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">
                  Donate anonymously
                </label>
              </div>
            </div>

            {/* Donate Button */}
            <Button onClick={handleDonate} disabled={isLoading || !donationForm.amount} className="w-full py-3 text-lg">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  Donate {donationForm.amount && formatCurrency(parseFloat(donationForm.amount))}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        {recentDonations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Recent Donations
              </CardTitle>
              <CardDescription>Latest support from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDonations.map(donation => (
                  <div key={donation.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-indigo-600">{formatCurrency(donation.amount)}</span>
                        <span className="text-sm text-gray-600">
                          from {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                        </span>
                      </div>
                      {donation.message && <p className="text-sm text-gray-600 mt-1">&quot;{donation.message}&quot;</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(donation.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Powered by SocialBuzz</p>
          <p>Secure payments &bull; Real-time notifications</p>
        </div>
      </div>
    </div>
  );
}

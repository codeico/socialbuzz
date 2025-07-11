'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Link as LinkIcon, 
  Calendar,
  Gift,
  Users,
  Star
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  totalEarnings: number;
  createdAt: string;
  isVerified: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationModal, setDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      setProfile({
        id: '1',
        username: username,
        fullName: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Content creator passionate about technology and education. Sharing knowledge through tutorials and live streams.',
        location: 'Jakarta, Indonesia',
        website: 'https://johndoe.com',
        socialLinks: {
          twitter: 'https://twitter.com/johndoe',
          instagram: 'https://instagram.com/johndoe',
          youtube: 'https://youtube.com/johndoe',
        },
        totalEarnings: 1250000,
        createdAt: '2024-01-15T00:00:00Z',
        isVerified: true,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async () => {
    if (!donationAmount || !profile) return;
    
    try {
      // In a real app, this would call your payment API
      const amount = parseFloat(donationAmount);
      
      // Create payment request
      const response = await fetch('/api/v1/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          recipientId: profile.id,
          amount: amount,
          paymentMethod: paymentMethod,
          message: donationMessage,
          isAnonymous: isAnonymous,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to payment URL
        window.location.href = data.data.paymentUrl;
      } else {
        alert('Payment creation failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Failed to create donation. Please try again.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Support ${profile?.fullName} on SocialBuzz`,
          text: `Check out ${profile?.fullName}'s profile and show your support!`,
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
              <div className="relative">
                <img
                  src={profile.avatar || '/default-avatar.png'}
                  alt={profile.fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
                {profile.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                    <Star size={12} />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
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
                    Joined {formatDate(profile.createdAt)}
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
                  {profile.bio || 'This user hasn\'t added a bio yet.'}
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
                
                {profile.socialLinks && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(profile.socialLinks).map(([platform, url]) => (
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
                <CardDescription>
                  People who have recently supported this creator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock supporter data */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Anonymous</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatCurrency(25000)}</p>
                      <p className="text-sm text-gray-500">Keep up the great work!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                        S
                      </div>
                      <div>
                        <p className="font-medium">Sarah K.</p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatCurrency(50000)}</p>
                      <p className="text-sm text-gray-500">Love your content!</p>
                    </div>
                  </div>
                </div>
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift size={20} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Total Received</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(profile.totalEarnings)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users size={20} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Supporters</span>
                  </div>
                  <span className="font-semibold">42</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart size={20} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">This Month</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(150000)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Support Button */}
            <Card>
              <CardHeader>
                <CardTitle>Support {profile.fullName}</CardTitle>
                <CardDescription>
                  Show your appreciation with a donation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setDonationModal(true)}
                  className="w-full"
                  size="lg"
                >
                  <Heart size={20} className="mr-2" />
                  Send Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <Modal
        isOpen={donationModal}
        onClose={() => setDonationModal(false)}
        title="Support this Creator"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount (IDR)
            </label>
            <Input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount (min. 1,000)"
              min="1000"
              fullWidth
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="virtual_account">Virtual Account</option>
              <option value="e_wallet">E-Wallet</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={donationMessage}
              onChange={(e) => setDonationMessage(e.target.value)}
              placeholder="Leave a message of support..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
              Make this donation anonymous
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDonationModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDonation}
              disabled={!donationAmount || parseFloat(donationAmount) < 1000}
              className="flex-1"
            >
              Send {donationAmount && formatCurrency(parseFloat(donationAmount))}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatter';
import {
  CheckCircle,
  Heart,
  Share2,
  Twitter,
  Facebook,
  MessageCircle,
  ArrowRight,
  Gift,
  Users,
  Zap,
} from 'lucide-react';

interface DonationDetails {
  id: string;
  amount: number;
  creatorName: string;
  creatorUsername: string;
  message: string;
  isAnonymous: boolean;
  timestamp: string;
}

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Get donation details from URL params or API
    const donationId = searchParams.get('id');
    const amount = searchParams.get('amount');
    const creator = searchParams.get('creator');

    if (donationId && amount && creator) {
      // Mock donation details - in real app, fetch from API
      setDonationDetails({
        id: donationId,
        amount: parseInt(amount),
        creatorName: decodeURIComponent(creator),
        creatorUsername: creator.toLowerCase().replace(' ', ''),
        message: searchParams.get('message') || '',
        isAnonymous: searchParams.get('anonymous') === 'true',
        timestamp: new Date().toISOString(),
      });
    }

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  }, [searchParams]);

  const handleShare = (platform: string) => {
    if (!donationDetails) {
      return;
    }

    const shareText = `I just supported ${donationDetails.creatorName} on SocialBuzz! 💖`;
    const shareUrl = `${window.location.origin}/profile/${donationDetails.creatorUsername}`;

    switch (platform) {
    case 'twitter':
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      );
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
      break;
    }
  };

  const copyToClipboard = () => {
    if (!donationDetails) {
      return;
    }

    const shareUrl = `${window.location.origin}/profile/${donationDetails.creatorUsername}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Profile link copied to clipboard!');
  };

  if (!donationDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 animate-pulse">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                {i % 3 === 0 ? '🎉' : i % 3 === 1 ? '💖' : '✨'}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <Card className="text-center mb-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          <CardContent className="p-8">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You! 🎉</h1>
            <p className="text-xl text-gray-600 mb-6">Your donation has been sent successfully!</p>

            {/* Donation Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-indigo-600 mr-3" />
                <span className="text-3xl font-bold text-indigo-600">{formatCurrency(donationDetails.amount)}</span>
              </div>

              <p className="text-lg text-gray-700 mb-2">
                donated to <span className="font-semibold text-indigo-600">{donationDetails.creatorName}</span>
            </p>

              {donationDetails.message && (
                <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-indigo-500">
                  <p className="text-gray-700 italic">&quot;{donationDetails.message}&quot;</p>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">Transaction ID: {donationDetails.id}</p>
            </div>

            {/* Creator Profile Link */}
            <Link href={`/profile/${donationDetails.creatorUsername}`}>
              <Button className="w-full mb-6">
                <Users className="mr-2 h-5 w-5" />
                Visit {donationDetails.creatorName}&apos;s Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Share Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Share2 className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Spread the Love</h2>
              <p className="text-gray-600">
                Help others discover {donationDetails.creatorName} by sharing their profile
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center"
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="ml-2 hidden sm:inline">Twitter</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="ml-2 hidden sm:inline">Facebook</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="ml-2 hidden sm:inline">WhatsApp</span>
              </Button>

              <Button variant="outline" onClick={copyToClipboard} className="flex items-center justify-center">
                <Share2 className="h-5 w-5 text-gray-600" />
                <span className="ml-2 hidden sm:inline">Copy Link</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s Next?</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Heart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Follow for Updates</p>
                  <p className="text-sm text-gray-600">
                    Stay updated with {donationDetails.creatorName}&apos;s latest content
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Join the Community</p>
                  <p className="text-sm text-gray-600">Connect with other supporters and fans</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Gift className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Support Again</p>
                  <p className="text-sm text-gray-600">Your support helps creators continue their amazing work</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/explore">
            <Button variant="outline" className="w-full">
              Discover More Creators
            </Button>
          </Link>

          <Link href="/">
            <Button className="w-full">
              Back to Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg border">
          <p className="text-gray-600 mb-2">Thank you for supporting creators on SocialBuzz! 💖</p>
          <p className="text-sm text-gray-500">Your contribution helps build a stronger creative community</p>
        </div>
      </div>
    </div>
  );
}

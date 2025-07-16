'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Home, Share2, ArrowLeft, Heart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatter';
import { usePlatformSettings } from '@/hooks/useSystemSettings';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transactionData, setTransactionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const { platformName } = usePlatformSettings();

  useEffect(() => {
    const loadSuccessData = async () => {
      const donationId = searchParams.get('donationId');
      const token = searchParams.get('token');
      
      if (donationId) {
        // Fetch donation data from database
        try {
          const response = await fetch(`/api/v1/donations/${donationId}`);
          const result = await response.json();

          if (result.success && result.data) {
            const donation = result.data;
            
            setTransactionData({
              transactionId: donation.duitku_transaction_id,
              recipientName: donation.recipient.full_name,
              recipientUsername: donation.recipient.username,
              amount: donation.amount,
              reference: donation.duitku_reference,
              donationId: donation.id,
              widgetUrl: `/widget/${donation.recipient.username}`,
              status: 'completed',
              createdAt: donation.created_at,
            });
          }
        } catch (error) {
          console.error('Error loading donation data:', error);
        }
      } else if (token) {
        // Fallback to session-based API (old flow)
        try {
          const response = await fetch(`/api/v1/payments/sessions?token=${token}`);
          const result = await response.json();

          if (result.success && result.data.type === 'payment_success') {
            const data = result.data.data;
            
            setTransactionData({
              transactionId: data.transactionId,
              recipientName: data.recipientName,
              amount: data.amount,
              widgetUrl: data.widgetUrl,
              reference: data.reference,
              status: 'completed',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error loading success data:', error);
        }
      }

      // Trigger confetti animation
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);

      setLoading(false);
    };

    loadSuccessData();
  }, [searchParams]);

  const handleShare = async () => {
    const shareData = {
      title: 'Saya baru saja memberikan donasi!',
      text: `Saya baru saja memberikan donasi ${formatCurrency(transactionData?.amount || 0)} untuk ${transactionData?.recipientName}. Mari dukung creator bersama!`,
      url: window.location.origin + (transactionData?.widgetUrl || `/widget/${transactionData?.recipientUsername || ''}`),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${shareData.text} ${shareData.url}`;
      await navigator.clipboard.writeText(text);
      alert('Link berhasil disalin ke clipboard!');
    }
  };

  const handleBackToWidget = () => {
    if (transactionData?.widgetUrl) {
      window.location.href = transactionData.widgetUrl;
    } else if (transactionData?.recipientUsername) {
      window.location.href = `/widget/${transactionData.recipientUsername}`;
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg space-y-6">
          <div className="flex justify-center mb-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              {platformName || 'SITENAME'}
            </Link>
          </div>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4 relative">
                <CheckCircle className="h-20 w-20 text-green-500 animate-pulse" />
                <Heart className="h-8 w-8 text-red-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <CardTitle className="text-2xl text-green-700">Pembayaran Berhasil!</CardTitle>
              <CardDescription className="text-green-600">Terima kasih atas dukungan Anda! 🎉</CardDescription>
            </CardHeader>

          <CardContent className="space-y-6">
            {/* Transaction Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Amount</span>
                  <span className="text-lg font-bold text-green-700">
                    {formatCurrency(transactionData?.amount || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Recipient</span>
                  <span className="text-sm text-green-700">{transactionData?.recipientName || 'Unknown'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Transaction ID</span>
                  <span className="text-sm text-green-700 font-mono">{transactionData?.transactionId || 'N/A'}</span>
                </div>

                {transactionData?.reference && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Reference</span>
                    <span className="text-sm text-green-700 font-mono">{transactionData.reference}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your support! 🎉</h3>
              <p className="text-gray-600">
                Your generosity helps creators continue doing what they love. You should receive a confirmation email
                shortly.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleBackToWidget}
                className="w-full py-3 text-lg font-semibold"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                Kembali
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleShare} variant="outline" className="w-full">
                  <Share2 size={16} className="mr-2" />
                  Bagikan
                </Button>

                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <Home size={16} className="mr-2" />
                    Beranda
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Langkah Selanjutnya</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Creator akan menerima notifikasi tentang donasi Anda</li>
                <li>• Donasi akan dikonfirmasi dalam 1-5 menit</li>
                <li>• Anda dapat memberikan donasi lagi kapan saja</li>
                <li>• Creator mungkin akan mengirim pesan terima kasih</li>
              </ul>
            </div>
          </CardContent>
        </Card>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Butuh bantuan? Hubungi{' '}
              <Link href="/support" className="text-indigo-600 hover:text-indigo-500">
                tim support kami
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

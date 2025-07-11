'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Home, Receipt, Share2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatter';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transactionData, setTransactionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const merchantOrderId = searchParams.get('merchantOrderId');
    const reference = searchParams.get('reference');
    
    if (merchantOrderId) {
      // In a real app, you would fetch the transaction details from your API
      // For now, we'll use the URL parameters
      setTransactionData({
        merchantOrderId,
        reference,
        amount: 50000, // This would come from your API
        recipientName: 'John Doe', // This would come from your API
        status: 'completed',
        createdAt: new Date().toISOString(),
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleShare = async () => {
    const shareData = {
      title: 'I just supported a creator on SocialBuzz!',
      text: `I just sent ${formatCurrency(transactionData?.amount || 0)} to support ${transactionData?.recipientName}. Join me in supporting amazing creators!`,
      url: window.location.origin,
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
      alert('Shared content copied to clipboard!');
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            SocialBuzz
          </Link>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-green-700">Payment Successful!</CardTitle>
            <CardDescription>
              Your support has been sent successfully
            </CardDescription>
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
                  <span className="text-sm text-green-700">
                    {transactionData?.recipientName || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Transaction ID</span>
                  <span className="text-sm text-green-700 font-mono">
                    {transactionData?.merchantOrderId || 'N/A'}
                  </span>
                </div>
                
                {transactionData?.reference && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Reference</span>
                    <span className="text-sm text-green-700 font-mono">
                      {transactionData.reference}
                    </span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank you for your support! 🎉
              </h3>
              <p className="text-gray-600">
                Your generosity helps creators continue doing what they love.
                You should receive a confirmation email shortly.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleShare}
                variant="outline"
                fullWidth
                className="justify-center"
              >
                <Share2 size={16} className="mr-2" />
                Share your support
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" fullWidth>
                    <Receipt size={16} className="mr-2" />
                    View Receipt
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button fullWidth>
                    <Home size={16} className="mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• The creator will receive your support within 24 hours</li>
                <li>• You'll get an email confirmation with transaction details</li>
                <li>• You can track this transaction in your dashboard</li>
                <li>• The creator may send you a thank you message</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our{' '}
            <Link href="/support" className="text-indigo-600 hover:text-indigo-500">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Copy, ExternalLink, Loader2 } from 'lucide-react';

interface PaymentLinkResponse {
  recipientId: string;
  paymentUrl: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
  };
  expiresAt: string;
}

export default function PaymentLinkDemo() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<PaymentLinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePaymentLink = async () => {
    if (!username.trim()) {
      setError('Please enter a creator username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/payments/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorUsername: username.trim()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentLink(result.data);
      } else {
        setError(result.error || 'Failed to generate payment link');
      }
    } catch (error) {
      console.error('Error generating payment link:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Link Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creator Username
              </label>
              <Input
                type="text"
                placeholder="Enter creator username (e.g., johnsmith)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button 
              onClick={generatePaymentLink}
              disabled={loading || !username.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Link...
                </>
              ) : (
                'Generate Payment Link'
              )}
            </Button>
          </CardContent>
        </Card>

        {paymentLink && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Payment Link Generated!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Creator Details
                </label>
                <div className="bg-white rounded-md p-3 border">
                  <p><strong>Name:</strong> {paymentLink.creator.displayName}</p>
                  <p><strong>Username:</strong> @{paymentLink.creator.username}</p>
                  <p><strong>ID:</strong> {paymentLink.creator.id}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Payment Link
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded-md p-3 border font-mono text-sm">
                    {paymentLink.paymentUrl}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(paymentLink.paymentUrl)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => openLink(paymentLink.paymentUrl)}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Recipient ID (UUID)
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded-md p-3 border font-mono text-sm">
                    {paymentLink.recipientId}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(paymentLink.recipientId)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Expires At
                </label>
                <div className="bg-white rounded-md p-3 border">
                  {new Date(paymentLink.expiresAt).toLocaleString()}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setPaymentLink(null);
                    setUsername('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Generate Another Link
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">How It Works</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enter a creator&apos;s username to generate a payment link</li>
              <li>• The system creates a random UUID for the recipient ID</li>
              <li>• Links expire after 24 hours for security</li>
              <li>• Payment links have the format: /payment/x/[uuid]</li>
              <li>• Users can select payment methods and see pop-up payment details</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
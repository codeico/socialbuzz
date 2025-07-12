'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home, RefreshCw, MessageCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-red-100 rounded-full animate-pulse"></div>
            </div>
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
        <p className="text-lg text-gray-600 mb-2">We encountered an unexpected error while processing your request.</p>
        <p className="text-sm text-gray-500 mb-8">
          Don&apos;t worry, our team has been notified and we&apos;re working on a fix.
        </p>

        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
            <p className="text-sm text-red-700 font-mono break-all">{error.message}</p>
            {error.digest && <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-2 text-sm">
            <Link href="/faq" className="block text-indigo-600 hover:text-indigo-800">
              Check our FAQ
            </Link>
            <Link href="/contact" className="block text-indigo-600 hover:text-indigo-800">
              Contact Support
            </Link>
            <Link href="/about" className="block text-indigo-600 hover:text-indigo-800">
              About SocialBuzz
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          <p>If this problem persists, please contact our support team</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-indigo-200 mb-4">404</div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-indigo-100 rounded-full animate-pulse"></div>
            </div>
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the
          wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/" className="block">
            <Button className="w-full">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/explore">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Explore
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
            </Link>
          </div>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Popular Pages</h3>
          <div className="space-y-2 text-sm">
            <Link href="/auth/register" className="block text-indigo-600 hover:text-indigo-800">
              Create Account
            </Link>
            <Link href="/auth/login" className="block text-indigo-600 hover:text-indigo-800">
              Login
            </Link>
            <Link href="/about" className="block text-indigo-600 hover:text-indigo-800">
              About SocialBuzz
            </Link>
            <Link href="/contact" className="block text-indigo-600 hover:text-indigo-800">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Error Code: 404 - Page Not Found</p>
        </div>
      </div>
    </div>
  );
}

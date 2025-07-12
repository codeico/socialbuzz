import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Main loader */}
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />

          {/* Pulse animation background */}
          <div className="absolute inset-0 -m-2">
            <div className="w-16 h-16 bg-indigo-100 rounded-full animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading SocialBuzz</h2>
        <p className="text-gray-600">Please wait while we prepare your experience...</p>

        {/* Loading dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface MaintenanceStatus {
  maintenance_mode: boolean;
  maintenance_message: string;
  platform_name: string;
}

interface MaintenanceCheckerProps {
  children: React.ReactNode;
  skipCheck?: boolean; // For admin pages
}

export const MaintenanceChecker: React.FC<MaintenanceCheckerProps> = ({ 
  children, 
  skipCheck = false 
}) => {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [loading, setLoading] = useState(!skipCheck);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skipCheck) return;

    const checkMaintenanceStatus = async () => {
      try {
        const response = await fetch('/api/v1/system/status');
        const data = await response.json();
        
        if (data.success) {
          setStatus(data.data);
        } else {
          setError('Failed to check system status');
        }
      } catch (error) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceStatus();

    // Check every 30 seconds
    const interval = setInterval(checkMaintenanceStatus, 30000);
    
    return () => clearInterval(interval);
  }, [skipCheck]);

  // If skip check is enabled, render children directly
  if (skipCheck) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Maintenance mode
  if (status?.maintenance_mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border">
            <div className="text-6xl mb-6">🔧</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {status.platform_name} is Under Maintenance
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {status.maintenance_message}
            </p>
            
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            
            <div className="text-sm text-gray-500 space-y-2">
              <p>We&apos;re working hard to get everything back online.</p>
              <p>This page will automatically refresh every 30 seconds.</p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal operation - render children
  return <>{children}</>;
};
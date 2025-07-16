'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/hooks/useAuth';
import { MaintenanceChecker } from '@/components/system/MaintenanceChecker';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  
  // Skip maintenance check for admin routes and API routes
  const skipMaintenanceCheck = pathname?.startsWith('/admin') || pathname?.startsWith('/api');
  
  return (
    <AuthProvider>
      <MaintenanceChecker skipCheck={skipMaintenanceCheck}>
        {children}
      </MaintenanceChecker>
    </AuthProvider>
  );
}

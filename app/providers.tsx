'use client';

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

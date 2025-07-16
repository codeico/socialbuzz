'use client';

import { useEffect } from 'react';
import { usePlatformSettings } from '@/hooks/useSystemSettings';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export function DynamicLayout({ children }: DynamicLayoutProps) {
  const { platformName, loading } = usePlatformSettings();

  useEffect(() => {
    if (!loading && platformName) {
      // Update document title dynamically
      document.title = `${platformName} - Support Your Favorite Creators`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Connect with your audience and receive support through secure donations on ${platformName}.`);
      }
      
      // Update OpenGraph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${platformName} - Support Your Favorite Creators`);
      }
      
      // Update OpenGraph description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', `Connect with your audience and receive support through secure donations on ${platformName}.`);
      }
      
      // Update Twitter title
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${platformName} - Support Your Favorite Creators`);
      }
      
      // Update Twitter description
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', `Connect with your audience and receive support through secure donations on ${platformName}.`);
      }
    }
  }, [platformName, loading]);

  return <>{children}</>;
}
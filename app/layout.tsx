import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { DynamicLayout } from '@/components/system/DynamicLayout';
import { supabaseAdmin } from '@/lib/supabase';

const inter = Inter({ subsets: ['latin'] });

// Function to get platform settings for metadata
async function getPlatformSettings() {
  try {
    const { data: settings } = await supabaseAdmin
      .from('system_settings')
      .select('category, key, value')
      .in('category', ['general', 'platform'])
      .in('key', ['platform_name', 'platform_description']);

    const platformName = settings?.find(s => s.key === 'platform_name')?.value || 'SocialBuzz';
    const platformDescription = settings?.find(s => s.key === 'platform_description')?.value || 'Connect with your audience and receive support through secure donations.';

    return { platformName, platformDescription };
  } catch (error) {
    return { 
      platformName: 'SocialBuzz', 
      platformDescription: 'Connect with your audience and receive support through secure donations.' 
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { platformName, platformDescription } = await getPlatformSettings();
  
  return {
    title: `${platformName} - Support Your Favorite Creators`,
    description: platformDescription,
    keywords: ['creators', 'donations', 'support', 'community', 'payments'],
    authors: [{ name: `${platformName} Team` }],
    openGraph: {
      title: `${platformName} - Support Your Favorite Creators`,
      description: platformDescription,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${platformName} - Support Your Favorite Creators`,
      description: platformDescription,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <DynamicLayout>
            {children}
          </DynamicLayout>
        </Providers>
      </body>
    </html>
  );
}

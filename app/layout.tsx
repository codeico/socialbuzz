import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialBuzz - Support Your Favorite Creators',
  description: 'Connect with your audience and receive support through secure donations. Build your community and grow your passion.',
  keywords: ['creators', 'donations', 'support', 'community', 'payments'],
  authors: [{ name: 'SocialBuzz Team' }],
  openGraph: {
    title: 'SocialBuzz - Support Your Favorite Creators',
    description: 'Connect with your audience and receive support through secure donations. Build your community and grow your passion.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialBuzz - Support Your Favorite Creators',
    description: 'Connect with your audience and receive support through secure donations. Build your community and grow your passion.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heart, Users, Zap, Shield, TrendingUp, Star, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'Easy Donations',
      description: 'Simple and secure way for supporters to show appreciation to their favorite creators.',
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: 'Real-time Alerts',
      description: 'Live donation notifications for streamers with customizable OBS overlays.',
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Secure Payments',
      description: 'Bank-grade security with multiple payment methods including credit cards and e-wallets.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into earnings, supporters, and growth metrics.',
    },
  ];

  const stats = [
    {
      label: 'Active Creators',
      value: '10,000+',
      icon: <Users className="h-6 w-6" />,
    },
    {
      label: 'Total Donations',
      value: 'Rp 50M+',
      icon: <Heart className="h-6 w-6" />,
    },
    {
      label: 'Happy Supporters',
      value: '100,000+',
      icon: <Star className="h-6 w-6" />,
    },
    {
      label: 'Success Rate',
      value: '99.9%',
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              SocialBuzz
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">Empowering Creators</h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-indigo-100 md:text-2xl">
              SocialBuzz is Indonesia&apos;s leading platform connecting creators with their supporters through secure
              and meaningful donations.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-indigo-600"
                >
                  Discover Creators
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center text-indigo-600">{stat.icon}</div>
                <div className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Why Choose SocialBuzz?</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              We provide everything creators need to build sustainable income streams and meaningful connections with
              their audience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="text-center transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Our Mission</h2>
              <p className="mb-6 text-lg text-gray-600">
                We believe every creator deserves to be rewarded for their passion and hard work. SocialBuzz bridges the
                gap between creators and supporters, making it easy for audiences to show appreciation through
                meaningful contributions.
              </p>
              <p className="mb-8 text-lg text-gray-600">
                From content creators and artists to educators and streamers, we empower creative minds across Indonesia
                to turn their passion into sustainable income.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Safe and secure payment processing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Real-time streaming integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Comprehensive analytics and insights</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
              <div className="text-center">
                <div className="mb-4 text-4xl font-bold text-indigo-600 md:text-5xl">2024</div>
                <p className="mb-6 text-lg text-gray-700">
                  Founded with a vision to revolutionize creator economy in Indonesia
                </p>
                <div className="space-y-4">
                  <div className="rounded-lg bg-white p-4">
                    <div className="text-2xl font-bold text-gray-900">Rp 50M+</div>
                    <div className="text-gray-600">Total payouts to creators</div>
                  </div>
                  <div className="rounded-lg bg-white p-4">
                    <div className="text-2xl font-bold text-gray-900">10,000+</div>
                    <div className="text-gray-600">Active creators on platform</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to Start Your Creator Journey?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-indigo-100">
            Join thousands of creators who are already earning from their passion. Set up your profile in minutes and
            start receiving support today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600"
              >
                Explore Creators
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">SocialBuzz</h3>
              <p className="text-gray-400">
                Empowering creators to build sustainable income streams through meaningful supporter connections.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/explore" className="hover:text-white">
                    Discover Creators
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-white">
                    Become a Creator
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SocialBuzz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

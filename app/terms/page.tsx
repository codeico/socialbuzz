import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, FileText, Shield, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              SocialBuzz
            </Link>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full">
              <FileText className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using SocialBuzz platform
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 11, 2024
          </p>
        </div>

        {/* Important Notice */}
        <Card className="border-yellow-200 bg-yellow-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700">
                  By accessing and using SocialBuzz, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                By accessing and using SocialBuzz ("the Platform", "we", "us", or "our"), you ("User", "you", or "your") agree to comply with and be bound by these Terms of Service ("Terms").
              </p>
              <p className="text-gray-700">
                These Terms apply to all users of the Platform, including creators, supporters, and visitors. If you disagree with any part of these terms, you may not access the Platform.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Platform Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                SocialBuzz is a platform that connects content creators with supporters through a donation-based system. The Platform allows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Creators to set up profiles and receive donations from supporters</li>
                <li>Supporters to discover and financially support creators</li>
                <li>Real-time donation notifications for streaming integration</li>
                <li>Secure payment processing through licensed payment providers</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                User Accounts and Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                To use certain features of the Platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate and complete</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Creator Obligations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                As a creator on the Platform, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Create original content or have proper rights to shared content</li>
                <li>Not engage in fraudulent, misleading, or deceptive practices</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Provide accurate information about your identity and bank details</li>
                <li>Not use the Platform for illegal activities or prohibited content</li>
                <li>Respond to supporter inquiries in a timely and professional manner</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Payment processing is handled by licensed third-party payment providers. By using our payment services, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Platform fee of 5% on all successful donations</li>
                <li>Payment processing fees as charged by payment providers</li>
                <li>Minimum payout threshold of Rp 100,000</li>
                <li>Payout processing time of 3-7 business days</li>
                <li>Provide valid bank account information for payouts</li>
                <li>Responsibility for any taxes on received donations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Prohibited Content and Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The following content and conduct are strictly prohibited on the Platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Illegal activities, fraud, or money laundering</li>
                <li>Hate speech, harassment, or discriminatory content</li>
                <li>Adult content or sexually explicit material</li>
                <li>Violence, threats, or harmful content</li>
                <li>Copyright infringement or intellectual property violations</li>
                <li>Spam, misleading information, or deceptive practices</li>
                <li>Impersonation of others or false identity claims</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The Platform and its original content, features, and functionality are owned by SocialBuzz and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700">
                Users retain ownership of content they create and share on the Platform but grant SocialBuzz a limited license to display, distribute, and promote such content as necessary for Platform operations.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">8</span>
                Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use the Platform. By using SocialBuzz, you consent to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">9</span>
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may terminate or suspend your account and access to the Platform immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p className="text-gray-700">
                You may terminate your account at any time by contacting us. Upon termination, your right to use the Platform will cease immediately.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">10</span>
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                SocialBuzz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
              </p>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">11</span>
                Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                Your continued use of the Platform after changes become effective constitutes acceptance of the revised Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-indigo-800 mb-2">Questions About These Terms?</h3>
                  <p className="text-indigo-700 mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <ul className="text-indigo-700 space-y-1">
                    <li>Email: legal@socialbuzz.com</li>
                    <li>Phone: +62 21 1234 5678</li>
                    <li>Address: Jakarta, Indonesia</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
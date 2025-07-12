import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
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
            <div className="bg-green-100 p-4 rounded-full">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 11, 2024
          </p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <UserCheck className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Your Privacy Matters</h3>
                  <p className="text-green-700">
                    SocialBuzz is committed to protecting your privacy and ensuring the security of your personal information. 
                    We only collect information necessary to provide our services and never sell your data to third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-3 h-6 w-6 text-indigo-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                <p className="text-gray-700 mb-3">
                  When you create an account or use our services, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Name, email address, and username</li>
                  <li>Profile information (bio, social media links, avatar)</li>
                  <li>Payment information (bank account details for payouts)</li>
                  <li>Communication preferences and settings</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
                <p className="text-gray-700 mb-3">
                  We automatically collect certain information when you use our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Page views, clicks, and time spent on platform</li>
                  <li>Transaction history and donation patterns</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-3 h-6 w-6 text-indigo-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process payments and donations securely</li>
                <li>Send you important updates and notifications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Detect and prevent fraud or unauthorized activity</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-3 h-6 w-6 text-indigo-600" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                <p className="text-gray-700">
                  We may share information with trusted third-party service providers who help us operate our platform, including payment processors, hosting services, and analytics providers.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                <p className="text-gray-700">
                  We may disclose information if required by law, court order, or government request, or to protect our rights, property, or safety.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                <p className="text-gray-700">
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>SSL encryption for data transmission</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and monitoring</li>
                <li>Limited access to personal information by employees</li>
                <li>Secure payment processing through licensed providers</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Access and Update</h4>
                  <p className="text-gray-700">
                    You can access and update your account information through your profile settings at any time.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Portability</h4>
                  <p className="text-gray-700">
                    You can request a copy of your personal data in a machine-readable format.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Account Deletion</h4>
                  <p className="text-gray-700">
                    You can request to delete your account and associated data through your settings or by contacting us.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Marketing Opt-out</h4>
                  <p className="text-gray-700">
                    You can unsubscribe from marketing communications at any time through your notification preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to enhance your experience on our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements (with your consent)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookie preferences through your browser settings.
              </p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. We ensure that appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Significant changes will be communicated through email or platform notifications.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-indigo-800 mb-2">Contact Us About Privacy</h3>
                  <p className="text-indigo-700 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <ul className="text-indigo-700 space-y-1">
                    <li>Email: privacy@socialbuzz.com</li>
                    <li>Phone: +62 21 1234 5678</li>
                    <li>Address: Jakarta, Indonesia</li>
                  </ul>
                  <p className="text-indigo-700 mt-4">
                    We will respond to your inquiry within 30 days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
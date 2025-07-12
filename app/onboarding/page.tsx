'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Heart, 
  Monitor, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  CreditCard,
  Zap
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    category: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      tiktok: '',
    },
    bankAccount: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Complete Your Profile',
      description: 'Tell your supporters about yourself',
      icon: <User className="h-6 w-6" />
    },
    {
      id: 2,
      title: 'Add Social Links',
      description: 'Connect your social media accounts',
      icon: <LinkIcon className="h-6 w-6" />
    },
    {
      id: 3,
      title: 'Setup Payment',
      description: 'Add your bank account for payouts',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      id: 4,
      title: 'OBS Integration',
      description: 'Setup streaming alerts',
      icon: <Monitor className="h-6 w-6" />
    },
    {
      id: 5,
      title: 'You\'re Ready!',
      description: 'Start receiving donations',
      icon: <Heart className="h-6 w-6" />
    }
  ];

  const categories = [
    'Gaming',
    'Art & Design',
    'Music',
    'Technology',
    'Education',
    'Lifestyle',
    'Business',
    'Entertainment',
    'Sports',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch('/api/v1/users/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      setError('Failed to complete onboarding. Please try again.');
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell your supporters about yourself, your content, and what you're passionate about..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Connect your social media accounts to help supporters find you across platforms.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                placeholder="https://twitter.com/username"
              />
              <Input
                label="Instagram"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                placeholder="https://instagram.com/username"
              />
              <Input
                label="YouTube"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                placeholder="https://youtube.com/channel/..."
              />
              <Input
                label="TikTok"
                value={formData.socialLinks.tiktok}
                onChange={(e) => handleInputChange('socialLinks.tiktok', e.target.value)}
                placeholder="https://tiktok.com/@username"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Add your bank account information to receive payouts from donations.
            </p>
            
            <div className="space-y-4">
              <Input
                label="Bank Name"
                value={formData.bankAccount.bankName}
                onChange={(e) => handleInputChange('bankAccount.bankName', e.target.value)}
                placeholder="e.g., Bank Mandiri"
                required
              />
              <Input
                label="Account Number"
                value={formData.bankAccount.accountNumber}
                onChange={(e) => handleInputChange('bankAccount.accountNumber', e.target.value)}
                placeholder="e.g., 1234567890"
                required
              />
              <Input
                label="Account Holder Name"
                value={formData.bankAccount.accountHolderName}
                onChange={(e) => handleInputChange('bankAccount.accountHolderName', e.target.value)}
                placeholder="Full name as registered in bank"
                required
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Make sure the account holder name matches your registered name exactly. 
                This information will be used for identity verification.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Set up real-time donation alerts for your streams and content.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <Monitor className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">OBS Overlay</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add donation alerts to your OBS streaming setup
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`/obs/${user?.id}/settings`, '_blank')}
                >
                  Setup OBS
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <Zap className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Donation Widget</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Embeddable widget for your website or social media
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`/widget/${user?.id}`, '_blank')}
                >
                  View Widget
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> You can customize your donation alerts with different themes, 
                animations, and sounds to match your branding!
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Congratulations! 🎉
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your creator profile is now complete and ready to receive donations.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-3">What's Next?</h3>
              <ul className="text-sm text-indigo-800 space-y-2 text-left">
                <li>• Share your profile link with your audience</li>
                <li>• Set up your streaming alerts if you stream</li>
                <li>• Create engaging content to grow your supporter base</li>
                <li>• Monitor your earnings through the dashboard</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(`/profile/${user?.username}`, '_blank')}
              >
                View Profile
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to SocialBuzz!
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your creator profile in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${currentStep > step.id 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {steps[currentStep - 1]?.icon}
              <span className="ml-3">{steps[currentStep - 1]?.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
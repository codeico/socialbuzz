'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Save,
  RefreshCw,
  Shield,
  DollarSign,
  Mail,
  Globe,
  Bell,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Server,
  Zap,
} from 'lucide-react';

interface SystemSettings {
  platform: {
    name: string;
    description: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string;
    maintenance_mode: boolean;
    maintenance_message: string;
  };
  payment: {
    duitku_merchant_code: string;
    duitku_api_key: string;
    duitku_sandbox_mode: boolean;
    minimum_donation: number;
    maximum_donation: number;
    platform_fee_percentage: number;
    auto_payout_threshold: number;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    smtp_secure: boolean;
    from_email: string;
    from_name: string;
  };
  security: {
    session_timeout: number;
    max_login_attempts: number;
    password_min_length: number;
    require_email_verification: boolean;
    enable_2fa: boolean;
    jwt_secret_rotation_days: number;
  };
  features: {
    user_registration: boolean;
    public_profiles: boolean;
    donation_goals: boolean;
    obs_integration: boolean;
    file_uploads: boolean;
    max_file_size_mb: number;
  };
  notifications: {
    email_notifications: boolean;
    push_notifications: boolean;
    admin_email: string;
    webhook_url: string;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    platform: {
      name: 'SocialBuzz',
      description: 'Creator donation platform',
      logo_url: '',
      primary_color: '#6366f1',
      secondary_color: '#8b5cf6',
      maintenance_mode: false,
      maintenance_message: 'We are currently performing maintenance. Please check back later.',
    },
    payment: {
      duitku_merchant_code: '',
      duitku_api_key: '',
      duitku_sandbox_mode: true,
      minimum_donation: 5000,
      maximum_donation: 10000000,
      platform_fee_percentage: 5,
      auto_payout_threshold: 100000,
    },
    email: {
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_secure: true,
      from_email: '',
      from_name: 'SocialBuzz',
    },
    security: {
      session_timeout: 24,
      max_login_attempts: 5,
      password_min_length: 8,
      require_email_verification: true,
      enable_2fa: false,
      jwt_secret_rotation_days: 30,
    },
    features: {
      user_registration: true,
      public_profiles: true,
      donation_goals: true,
      obs_integration: true,
      file_uploads: true,
      max_file_size_mb: 10,
    },
    notifications: {
      email_notifications: true,
      push_notifications: false,
      admin_email: '',
      webhook_url: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('platform');
  const [showPasswords, setShowPasswords] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSettings({ ...settings, ...data.data });
        setError('');
      } else {
        setError(data.error || 'Failed to load settings');
      }
    } catch (error) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Settings saved successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      setTestingConnection(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings.email),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Email connection test successful');
      } else {
        setError(data.error || 'Email connection test failed');
      }
    } catch (error) {
      setError('Email connection test failed');
    } finally {
      setTestingConnection(false);
    }
  };

  const updateSetting = (category: keyof SystemSettings, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: 'platform', label: 'Platform', icon: Globe },
    { id: 'payment', label: 'Payment', icon: DollarSign },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab="settings">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="mt-2 text-gray-600">Configure platform settings and preferences</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadSettings} variant="outline" disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={saveSettings} disabled={saving}>
                <Save className={`mr-2 h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="flex items-center p-4">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="flex items-center p-4">
              <Check className="mr-2 h-5 w-5 text-green-600" />
              <p className="text-green-600">{success}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Platform Settings */}
            {activeTab === 'platform' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Platform Settings
                  </CardTitle>
                  <CardDescription>Configure basic platform information and appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Platform Name</label>
                      <Input
                        value={settings.platform.name}
                        onChange={e => updateSetting('platform', 'name', e.target.value)}
                        placeholder="SocialBuzz"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Logo URL</label>
                      <Input
                        value={settings.platform.logo_url}
                        onChange={e => updateSetting('platform', 'logo_url', e.target.value)}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Platform Description</label>
                    <textarea
                      value={settings.platform.description}
                      onChange={e => updateSetting('platform', 'description', e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:ring-indigo-500"
                      rows={3}
                      placeholder="Creator donation platform"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Primary Color</label>
                      <Input
                        type="color"
                        value={settings.platform.primary_color}
                        onChange={e => updateSetting('platform', 'primary_color', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Secondary Color</label>
                      <Input
                        type="color"
                        value={settings.platform.secondary_color}
                        onChange={e => updateSetting('platform', 'secondary_color', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-gray-600">Put the platform in maintenance mode</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.platform.maintenance_mode}
                          onChange={e => updateSetting('platform', 'maintenance_mode', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>
                    {settings.platform.maintenance_mode && (
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Maintenance Message</label>
                        <textarea
                          value={settings.platform.maintenance_message}
                          onChange={e => updateSetting('platform', 'maintenance_message', e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:ring-indigo-500"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Payment Settings
                  </CardTitle>
                  <CardDescription>Configure Duitku payment gateway and fee settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Duitku Merchant Code</label>
                      <Input
                        value={settings.payment.duitku_merchant_code}
                        onChange={e => updateSetting('payment', 'duitku_merchant_code', e.target.value)}
                        placeholder="Enter merchant code"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Duitku API Key</label>
                      <div className="relative">
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          value={settings.payment.duitku_api_key}
                          onChange={e => updateSetting('payment', 'duitku_api_key', e.target.value)}
                          placeholder="Enter API key"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Sandbox Mode</h3>
                      <p className="text-sm text-gray-600">Use Duitku sandbox for testing</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={settings.payment.duitku_sandbox_mode}
                        onChange={e => updateSetting('payment', 'duitku_sandbox_mode', e.target.checked)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Minimum Donation (IDR)</label>
                      <Input
                        type="number"
                        value={settings.payment.minimum_donation}
                        onChange={e => updateSetting('payment', 'minimum_donation', parseInt(e.target.value))}
                        min="1000"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Maximum Donation (IDR)</label>
                      <Input
                        type="number"
                        value={settings.payment.maximum_donation}
                        onChange={e => updateSetting('payment', 'maximum_donation', parseInt(e.target.value))}
                        min="1000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Platform Fee (%)</label>
                      <Input
                        type="number"
                        value={settings.payment.platform_fee_percentage}
                        onChange={e => updateSetting('payment', 'platform_fee_percentage', parseInt(e.target.value))}
                        min="0"
                        max="50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Auto Payout Threshold (IDR)
                      </label>
                      <Input
                        type="number"
                        value={settings.payment.auto_payout_threshold}
                        onChange={e => updateSetting('payment', 'auto_payout_threshold', parseInt(e.target.value))}
                        min="50000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Settings
                  </CardTitle>
                  <CardDescription>Configure SMTP settings for email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">SMTP Host</label>
                      <Input
                        value={settings.email.smtp_host}
                        onChange={e => updateSetting('email', 'smtp_host', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">SMTP Port</label>
                      <Input
                        type="number"
                        value={settings.email.smtp_port}
                        onChange={e => updateSetting('email', 'smtp_port', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">SMTP Username</label>
                      <Input
                        value={settings.email.smtp_username}
                        onChange={e => updateSetting('email', 'smtp_username', e.target.value)}
                        placeholder="your-email@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">SMTP Password</label>
                      <div className="relative">
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          value={settings.email.smtp_password}
                          onChange={e => updateSetting('email', 'smtp_password', e.target.value)}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">From Email</label>
                      <Input
                        value={settings.email.from_email}
                        onChange={e => updateSetting('email', 'from_email', e.target.value)}
                        placeholder="noreply@socialbuzz.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">From Name</label>
                      <Input
                        value={settings.email.from_name}
                        onChange={e => updateSetting('email', 'from_name', e.target.value)}
                        placeholder="SocialBuzz"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Use SSL/TLS</h3>
                      <p className="text-sm text-gray-600">Enable secure connection</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={settings.email.smtp_secure}
                        onChange={e => updateSetting('email', 'smtp_secure', e.target.checked)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                    </label>
                  </div>

                  <div className="border-t pt-6">
                    <Button
                      onClick={testEmailConnection}
                      variant="outline"
                      disabled={testingConnection}
                      className="w-full"
                    >
                      <Server className={`mr-2 h-4 w-4 ${testingConnection ? 'animate-spin' : ''}`} />
                      {testingConnection ? 'Testing Connection...' : 'Test Email Connection'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure security and authentication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Session Timeout (hours)</label>
                      <Input
                        type="number"
                        value={settings.security.session_timeout}
                        onChange={e => updateSetting('security', 'session_timeout', parseInt(e.target.value))}
                        min="1"
                        max="168"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Max Login Attempts</label>
                      <Input
                        type="number"
                        value={settings.security.max_login_attempts}
                        onChange={e => updateSetting('security', 'max_login_attempts', parseInt(e.target.value))}
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Minimum Password Length</label>
                      <Input
                        type="number"
                        value={settings.security.password_min_length}
                        onChange={e => updateSetting('security', 'password_min_length', parseInt(e.target.value))}
                        min="6"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">JWT Secret Rotation (days)</label>
                      <Input
                        type="number"
                        value={settings.security.jwt_secret_rotation_days}
                        onChange={e => updateSetting('security', 'jwt_secret_rotation_days', parseInt(e.target.value))}
                        min="7"
                        max="365"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Require Email Verification</h3>
                        <p className="text-sm text-gray-600">Users must verify email before login</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.security.require_email_verification}
                          onChange={e => updateSetting('security', 'require_email_verification', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Enable Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.security.enable_2fa}
                          onChange={e => updateSetting('security', 'enable_2fa', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Settings */}
            {activeTab === 'features' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    Feature Settings
                  </CardTitle>
                  <CardDescription>Enable or disable platform features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">User Registration</h3>
                        <p className="text-sm text-gray-600">Allow new users to register</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.features.user_registration}
                          onChange={e => updateSetting('features', 'user_registration', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Public Profiles</h3>
                        <p className="text-sm text-gray-600">Allow public access to user profiles</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.features.public_profiles}
                          onChange={e => updateSetting('features', 'public_profiles', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Donation Goals</h3>
                        <p className="text-sm text-gray-600">Allow creators to set donation goals</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.features.donation_goals}
                          onChange={e => updateSetting('features', 'donation_goals', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">OBS Integration</h3>
                        <p className="text-sm text-gray-600">Enable donation notifications for OBS</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.features.obs_integration}
                          onChange={e => updateSetting('features', 'obs_integration', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">File Uploads</h3>
                        <p className="text-sm text-gray-600">Allow users to upload files</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.features.file_uploads}
                          onChange={e => updateSetting('features', 'file_uploads', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>
                  </div>

                  {settings.features.file_uploads && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Max File Size (MB)</label>
                      <Input
                        type="number"
                        value={settings.features.max_file_size_mb}
                        onChange={e => updateSetting('features', 'max_file_size_mb', parseInt(e.target.value))}
                        min="1"
                        max="100"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Configure notification preferences and webhooks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.notifications.email_notifications}
                          onChange={e => updateSetting('notifications', 'email_notifications', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Send browser push notifications</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={settings.notifications.push_notifications}
                          onChange={e => updateSetting('notifications', 'push_notifications', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Admin Email</label>
                      <Input
                        value={settings.notifications.admin_email}
                        onChange={e => updateSetting('notifications', 'admin_email', e.target.value)}
                        placeholder="admin@socialbuzz.com"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Webhook URL</label>
                      <Input
                        value={settings.notifications.webhook_url}
                        onChange={e => updateSetting('notifications', 'webhook_url', e.target.value)}
                        placeholder="https://api.example.com/webhook"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

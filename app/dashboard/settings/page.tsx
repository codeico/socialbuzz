'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { 
  Bell, 
  Shield, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    donations: true,
    payouts: true,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEarnings: true,
    showDonations: true,
  });
  const [bankAccount, setBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBankAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankAccount(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Save settings to API
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          notifications,
          privacy,
          bankAccount,
        }),
      });

      if (response.ok) {
        setSuccess('Settings saved successfully!');
      } else {
        setError('Failed to save settings');
      }
    } catch (error) {
      setError('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError('Failed to change password');
      }
    } catch (error) {
      setError('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        logout();
      } else {
        setError('Failed to delete account');
      }
    } catch (error) {
      setError('Error deleting account');
    }
  };

  return (
    <DashboardLayout activeTab="settings" onTabChange={() => {}}>
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell size={20} className="mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Donation Notifications</p>
                  <p className="text-sm text-gray-600">Get notified when you receive donations</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.donations}
                  onChange={(e) => handleNotificationChange('donations', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payout Notifications</p>
                  <p className="text-sm text-gray-600">Get notified about payout status updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.payouts}
                  onChange={(e) => handleNotificationChange('payouts', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-600">Receive tips and platform updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield size={20} className="mr-2" />
                Privacy
              </CardTitle>
              <CardDescription>
                Control your privacy and visibility settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-gray-600">Make your profile visible to everyone</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.profileVisible}
                  onChange={(e) => handlePrivacyChange('profileVisible', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Earnings</p>
                  <p className="text-sm text-gray-600">Display your total earnings on profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showEarnings}
                  onChange={(e) => handlePrivacyChange('showEarnings', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Donation History</p>
                  <p className="text-sm text-gray-600">Display recent donations on profile</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showDonations}
                  onChange={(e) => handlePrivacyChange('showDonations', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard size={20} className="mr-2" />
                Bank Account
              </CardTitle>
              <CardDescription>
                Add your bank account for payouts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bank Name"
                  name="bankName"
                  value={bankAccount.bankName}
                  onChange={handleBankAccountChange}
                  placeholder="e.g., Bank Mandiri"
                />
                
                <Input
                  label="Account Number"
                  name="accountNumber"
                  value={bankAccount.accountNumber}
                  onChange={handleBankAccountChange}
                  placeholder="e.g., 1234567890"
                />
              </div>
              
              <Input
                label="Account Holder Name"
                name="accountHolderName"
                value={bankAccount.accountHolderName}
                onChange={handleBankAccountChange}
                placeholder="Full name as registered in bank"
              />
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="relative">
                <Input
                  label="New Password"
                  name="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <Button
                onClick={handleChangePassword}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleSaveSettings} loading={loading}>
                <Save size={16} className="mr-2" />
                Save All Settings
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle size={20} className="mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800">Delete Account</p>
                    <p className="text-sm text-red-700">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
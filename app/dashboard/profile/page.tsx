'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { Upload, Camera, Save, ExternalLink } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    website: '',
    location: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      tiktok: '',
    },
  });
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const profile = data.data;
        setFormData({
          fullName: profile.full_name || '',
          bio: profile.bio || '',
          website: profile.website || '',
          location: profile.location || '',
          socialLinks: profile.socialLinks || {
            twitter: '',
            instagram: '',
            youtube: '',
            tiktok: '',
          },
        });
        setAvatar(profile.avatar || '');
      } else {
        setError('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'avatar');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setAvatar(result.data.url);
        setSuccess('Avatar uploaded successfully!');
      } else {
        setError('Failed to upload avatar');
      }
    } catch (error) {
      setError('Error uploading avatar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          avatar: avatar,
          bio: formData.bio,
          website: formData.website,
          location: formData.location,
          socialLinks: formData.socialLinks,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Profile updated successfully!');
        // Reload profile data to ensure consistency
        await loadProfileData();
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <DashboardLayout activeTab="profile" onTabChange={() => {}}>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="profile" onTabChange={() => {}}>
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your profile information and public presence.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Photo */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Upload a photo that represents you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Image
                      src={avatar || '/default-avatar.png'}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700">
                      <Camera size={16} />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click the camera icon to upload a new photo</p>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your basic profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />

                    <Input label="Username" value={user?.username || ''} disabled className="bg-gray-50" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Tell people about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                    />

                    <Input
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                    />
                  </div>

                  <Button type="submit" loading={loading}>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Twitter"
                  value={formData.socialLinks.twitter}
                  onChange={e => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                />

                <Input
                  label="Instagram"
                  value={formData.socialLinks.instagram}
                  onChange={e => handleSocialLinkChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                />

                <Input
                  label="YouTube"
                  value={formData.socialLinks.youtube}
                  onChange={e => handleSocialLinkChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/channel/..."
                />

                <Input
                  label="TikTok"
                  value={formData.socialLinks.tiktok}
                  onChange={e => handleSocialLinkChange('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@username"
                />
              </div>
            </CardContent>
          </Card>

          {/* Public Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>Your public profile URL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Input value={`${window.location.origin}/profile/${user?.username}`} readOnly className="bg-gray-50" />
                <Button variant="outline" onClick={() => window.open(`/profile/${user?.username}`, '_blank')}>
                  <ExternalLink size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

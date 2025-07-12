'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import { Settings, Eye, Volume2, Palette, Monitor, TestTube, Copy, ExternalLink, Save } from 'lucide-react';

interface OBSSettings {
  theme: 'default' | 'neon' | 'minimal' | 'gaming';
  showAmount: boolean;
  showMessage: boolean;
  showDonorName: boolean;
  duration: number;
  soundEnabled: boolean;
  soundVolume: number;
  animationType: 'slide' | 'fade' | 'bounce' | 'zoom';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  fontSize: 'small' | 'medium' | 'large';
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

const defaultSettings: OBSSettings = {
  theme: 'default',
  showAmount: true,
  showMessage: true,
  showDonorName: true,
  duration: 5000,
  soundEnabled: true,
  soundVolume: 0.7,
  animationType: 'slide',
  position: 'top-right',
  fontSize: 'medium',
  backgroundColor: '#1f2937',
  textColor: '#ffffff',
  accentColor: '#3b82f6',
};

export default function OBSSettings() {
  const params = useParams();
  const creatorId = params.creatorId as string;
  const { user } = useAuth();
  const [settings, setSettings] = useState<OBSSettings>(defaultSettings);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const overlayUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/obs/${creatorId}`;

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem(`obs-settings-${creatorId}`);
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    // Initialize WebSocket for testing
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket for testing');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [creatorId]);

  const handleSettingChange = (key: keyof OBSSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem(`obs-settings-${creatorId}`, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyOverlayUrl = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendTestDonation = () => {
    if (socket) {
      socket.emit('test-donation', { creatorId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OBS Donation Alerts</h1>
          <p className="text-gray-600">Configure your donation alerts for streaming</p>
        </div>

        {/* URL Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="mr-2 h-5 w-5" />
              OBS Setup
            </CardTitle>
            <CardDescription>Add this URL as a Browser Source in OBS Studio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overlay URL</label>
                <div className="flex items-center space-x-2">
                  <Input value={overlayUrl} readOnly className="bg-gray-50 font-mono text-sm" />
                  <Button onClick={copyOverlayUrl} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button onClick={() => window.open(overlayUrl, '_blank')} variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">OBS Studio Setup Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Open OBS Studio</li>
                  <li>Add a new &quot;Browser Source&quot; to your scene</li>
                  <li>Paste the URL above into the URL field</li>
                  <li>Set Width: 1920, Height: 1080</li>
                  <li>Check &quot;Shutdown source when not visible&quot;</li>
                  <li>Check &quot;Refresh browser when scene becomes active&quot;</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Display Settings
            </CardTitle>
            <CardDescription>Configure what information to show in donation alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showAmount"
                    checked={settings.showAmount}
                    onChange={e => handleSettingChange('showAmount', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="showAmount" className="text-sm font-medium text-gray-700">
                    Show donation amount
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showDonorName"
                    checked={settings.showDonorName}
                    onChange={e => handleSettingChange('showDonorName', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="showDonorName" className="text-sm font-medium text-gray-700">
                    Show donor name
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showMessage"
                    checked={settings.showMessage}
                    onChange={e => handleSettingChange('showMessage', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="showMessage" className="text-sm font-medium text-gray-700">
                    Show donation message
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alert Duration (seconds)</label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={settings.duration / 1000}
                    onChange={e => handleSettingChange('duration', parseInt(e.target.value) * 1000)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{settings.duration / 1000}s</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select
                    value={settings.fontSize}
                    onChange={e => handleSettingChange('fontSize', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme & Animation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Theme & Animation
            </CardTitle>
            <CardDescription>Customize the look and feel of your alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={e => handleSettingChange('theme', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="default">Default</option>
                    <option value="neon">Neon</option>
                    <option value="minimal">Minimal</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animation Type</label>
                  <select
                    value={settings.animationType}
                    onChange={e => handleSettingChange('animationType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="slide">Slide</option>
                    <option value="fade">Fade</option>
                    <option value="bounce">Bounce</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    value={settings.position}
                    onChange={e => handleSettingChange('position', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="center">Center</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={e => handleSettingChange('accentColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={e => handleSettingChange('backgroundColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <input
                    type="color"
                    value={settings.textColor}
                    onChange={e => handleSettingChange('textColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sound Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="mr-2 h-5 w-5" />
              Sound Settings
            </CardTitle>
            <CardDescription>Configure audio alerts for donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={settings.soundEnabled}
                  onChange={e => handleSettingChange('soundEnabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="soundEnabled" className="text-sm font-medium text-gray-700">
                  Enable sound alerts
                </label>
              </div>

              {settings.soundEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sound Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.soundVolume}
                    onChange={e => handleSettingChange('soundVolume', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="mr-2 h-5 w-5" />
              Testing
            </CardTitle>
            <CardDescription>Test your donation alerts to see how they look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={sendTestDonation} className="w-full">
                Send Test Donation
              </Button>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Make sure your OBS overlay is open in another tab to see the test donation
                  alert.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} className="px-8">
            <Save className="mr-2 h-4 w-4" />
            {saved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

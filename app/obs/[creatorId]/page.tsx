'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { formatCurrency } from '@/utils/formatter';
import { DonationNotification } from '@/lib/websocket';

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

export default function OBSOverlay() {
  const params = useParams();
  const creatorId = params.creatorId as string;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [settings, setSettings] = useState<OBSSettings>(defaultSettings);
  const [currentDonation, setCurrentDonation] = useState<DonationNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [donationQueue, setDonationQueue] = useState<DonationNotification[]>([]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem(`obs-settings-${creatorId}`);
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    // Initialize WebSocket connection
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('join-obs-overlay', {
        creatorId,
        overlayId: `obs-${Date.now()}`,
      });
    });

    newSocket.on('overlay-connected', (data) => {
      console.log('OBS overlay connected:', data);
    });

    newSocket.on('donation-alert', (donation: DonationNotification) => {
      console.log('Received donation:', donation);
      setDonationQueue(prev => [...prev, donation]);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [creatorId]);

  useEffect(() => {
    // Process donation queue
    if (donationQueue.length > 0 && !currentDonation) {
      const nextDonation = donationQueue[0];
      setCurrentDonation(nextDonation);
      setDonationQueue(prev => prev.slice(1));
      setIsVisible(true);

      // Play sound if enabled
      if (settings.soundEnabled) {
        playDonationSound();
      }

      // Hide after duration
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentDonation(null);
        }, 500); // Wait for fade out animation
      }, settings.duration);
    }
  }, [donationQueue, currentDonation, settings.duration, settings.soundEnabled]);

  const playDonationSound = () => {
    try {
      const audio = new Audio('/sounds/donation-alert.mp3');
      audio.volume = settings.soundVolume;
      audio.play().catch(e => console.log('Could not play sound:', e));
    } catch (error) {
      console.log('Sound not available:', error);
    }
  };

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'neon':
        return 'bg-black border-2 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-400/50';
      case 'minimal':
        return 'bg-white/90 text-gray-800 border border-gray-200 shadow-sm';
      case 'gaming':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-400 shadow-lg';
      default:
        return `bg-gray-900 text-white border border-gray-700 shadow-lg`;
    }
  };

  const getPositionClasses = () => {
    switch (settings.position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-500';
    
    if (!isVisible) {
      switch (settings.animationType) {
        case 'slide':
          return `${baseClasses} opacity-0 transform translate-x-full`;
        case 'fade':
          return `${baseClasses} opacity-0`;
        case 'bounce':
          return `${baseClasses} opacity-0 transform scale-50`;
        case 'zoom':
          return `${baseClasses} opacity-0 transform scale-0`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }

    switch (settings.animationType) {
      case 'slide':
        return `${baseClasses} opacity-100 transform translate-x-0`;
      case 'fade':
        return `${baseClasses} opacity-100`;
      case 'bounce':
        return `${baseClasses} opacity-100 transform scale-100 animate-bounce`;
      case 'zoom':
        return `${baseClasses} opacity-100 transform scale-100`;
      default:
        return `${baseClasses} opacity-100`;
    }
  };

  const getFontSizeClasses = () => {
    switch (settings.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  if (!currentDonation) {
    return (
      <div className="w-screen h-screen bg-transparent">
        {/* Hidden div to maintain connection */}
        <div className="opacity-0 text-xs">OBS Overlay Ready - Creator: {creatorId}</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-transparent pointer-events-none">
      <div 
        className={`
          fixed max-w-md p-4 rounded-lg backdrop-blur-sm
          ${getPositionClasses()}
          ${getThemeClasses()}
          ${getAnimationClasses()}
          ${getFontSizeClasses()}
        `}
      >
        <div className="flex items-center space-x-3">
          {/* Donation Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">💖</span>
            </div>
          </div>

          {/* Donation Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              {settings.showAmount && (
                <span className="font-bold text-lg" style={{ color: settings.accentColor }}>
                  {formatCurrency(currentDonation.amount)}
                </span>
              )}
              {settings.showDonorName && (
                <span className="font-medium">
                  from {currentDonation.isAnonymous ? 'Anonymous' : currentDonation.donorName}
                </span>
              )}
            </div>
            
            {settings.showMessage && currentDonation.message && (
              <p className="mt-1 text-sm opacity-90 break-words">
                "{currentDonation.message}"
              </p>
            )}
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-3 w-full bg-gray-600 rounded-full h-1">
          <div 
            className="h-1 rounded-full transition-all duration-100"
            style={{ 
              backgroundColor: settings.accentColor,
              animation: `shrink ${settings.duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
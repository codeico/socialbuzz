import { useState, useEffect, useCallback } from 'react';

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
    minimum_donation: number;
    maximum_donation: number;
    platform_fee_percentage: number;
    predefined_amounts: number[];
    duitku_sandbox_mode: boolean;
  };
  features: {
    user_registration: boolean;
    public_profiles: boolean;
    donation_goals: boolean;
    obs_integration: boolean;
    file_uploads: boolean;
    max_file_size_mb: number;
  };
  security: {
    require_email_verification: boolean;
    password_min_length: number;
  };
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from public system settings API first
      const response = await fetch('/api/v1/system/public-settings');
      const data = await response.json();

      if (data.success) {
        // Use the data directly from admin settings structure
        const settingsData = data.data;
        
        const transformedSettings: SystemSettings = {
          platform: {
            name: settingsData.platform?.name || 'SocialBuzz',
            description: settingsData.platform?.description || 'Creator support platform',
            logo_url: settingsData.platform?.logo_url || '',
            primary_color: settingsData.platform?.primary_color || '#6366f1',
            secondary_color: settingsData.platform?.secondary_color || '#8b5cf6',
            maintenance_mode: settingsData.platform?.maintenance_mode || false,
            maintenance_message: settingsData.platform?.maintenance_message || 'We are currently performing maintenance. Please check back later.',
          },
          payment: {
            minimum_donation: settingsData.payment?.minimum_donation || 5000,
            maximum_donation: settingsData.payment?.maximum_donation || 10000000,
            platform_fee_percentage: settingsData.payment?.platform_fee_percentage || 5,
            predefined_amounts: settingsData.payment?.predefined_amounts || [8338000, 16670000, 25003000, 33335000, 41668000, 50000000],
            duitku_sandbox_mode: settingsData.payment?.duitku_sandbox_mode !== undefined ? settingsData.payment.duitku_sandbox_mode : true,
          },
          features: {
            user_registration: settingsData.features?.user_registration ?? true,
            public_profiles: settingsData.features?.public_profiles ?? true,
            donation_goals: settingsData.features?.donation_goals ?? true,
            obs_integration: settingsData.features?.obs_integration ?? true,
            file_uploads: settingsData.features?.file_uploads ?? true,
            max_file_size_mb: settingsData.features?.max_file_size_mb || 10,
          },
          security: {
            require_email_verification: settingsData.security?.require_email_verification ?? true,
            password_min_length: settingsData.security?.password_min_length || 8,
          },
        };

        setSettings(transformedSettings);
      } else {
        setError('Failed to fetch settings');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };
};

// Helper hook for specific setting values
export const useFeatureFlag = (feature: keyof SystemSettings['features']) => {
  const { settings, loading } = useSystemSettings();
  
  return {
    isEnabled: settings?.features[feature] ?? true,
    loading,
  };
};

export const useMaintenanceMode = () => {
  const { settings, loading } = useSystemSettings();
  
  return {
    isMaintenanceMode: settings?.platform.maintenance_mode ?? false,
    maintenanceMessage: settings?.platform.maintenance_message ?? '',
    loading,
  };
};

export const usePlatformSettings = () => {
  const { settings, loading } = useSystemSettings();
  
  return {
    platformName: settings?.platform.name ?? 'SocialBuzz',
    primaryColor: settings?.platform.primary_color ?? '#6366f1',
    secondaryColor: settings?.platform.secondary_color ?? '#8b5cf6',
    logoUrl: settings?.platform.logo_url ?? '',
    loading,
  };
};

export const usePaymentSettings = () => {
  const { settings, loading } = useSystemSettings();
  
  return {
    minDonation: settings?.payment.minimum_donation ?? 5000,
    maxDonation: settings?.payment.maximum_donation ?? 10000000,
    platformFee: settings?.payment.platform_fee_percentage ?? 5,
    predefinedAmounts: settings?.payment.predefined_amounts ?? [8338000, 16670000, 25003000, 33335000, 41668000, 50000000],
    sandboxMode: settings?.payment.duitku_sandbox_mode !== undefined ? settings.payment.duitku_sandbox_mode : true,
    loading,
  };
};
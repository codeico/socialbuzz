import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get public settings from database (only public settings, no sensitive data)
    const { data: settings, error } = await supabaseAdmin
      .from('system_settings')
      .select('category, key, value, type, is_public')
      .eq('is_public', true)
      .order('category')
      .order('key');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Transform settings into grouped structure
    const groupedSettings: any = {
      platform: {},
      payment: {},
      features: {},
      security: {},
    };

    // Process each setting
    settings?.forEach((setting) => {
      let value = setting.value;
      
      // Parse value based on type
      try {
        switch (setting.type) {
          case 'boolean':
            value = value === 'true';
            break;
          case 'number':
            value = parseInt(value);
            break;
          case 'json':
            value = JSON.parse(value);
            break;
          default:
            // Keep as string
            break;
        }
      } catch (e) {
        console.warn(`Failed to parse ${setting.key}:`, e);
      }

      // Group by category
      if (groupedSettings[setting.category]) {
        groupedSettings[setting.category][setting.key] = value;
      }
      
      // Map to expected platform structure
      if (setting.category === 'general') {
        if (setting.key === 'platform_name') {
          groupedSettings.platform.name = value;
        } else if (setting.key === 'platform_description') {
          groupedSettings.platform.description = value;
        } else if (setting.key === 'maintenance_mode') {
          groupedSettings.platform.maintenance_mode = value;
        } else if (setting.key === 'allow_registration') {
          groupedSettings.features.user_registration = value;
        }
      } else if (setting.category === 'payment') {
        if (setting.key === 'min_donation_amount' || setting.key === 'minimum_donation') {
          groupedSettings.payment.minimum_donation = value;
        } else if (setting.key === 'max_donation_amount' || setting.key === 'maximum_donation') {
          groupedSettings.payment.maximum_donation = value;
        } else if (setting.key === 'platform_fee_percentage') {
          groupedSettings.payment.platform_fee_percentage = value;
        } else if (setting.key === 'predefined_amounts') {
          groupedSettings.payment.predefined_amounts = value;
        } else if (setting.key === 'duitku_sandbox_mode') {
          groupedSettings.payment.duitku_sandbox_mode = value;
        }
      }
    });

    // Add default values for missing platform fields
    groupedSettings.platform = {
      name: groupedSettings.platform.name || 'SocialBuzz',
      description: groupedSettings.platform.description || 'Creator support platform',
      logo_url: groupedSettings.platform.logo_url || '',
      primary_color: groupedSettings.platform.primary_color || '#6366f1',
      secondary_color: groupedSettings.platform.secondary_color || '#8b5cf6',
      maintenance_mode: groupedSettings.platform.maintenance_mode || false,
      maintenance_message: groupedSettings.platform.maintenance_message || 'We are currently performing maintenance. Please check back later.',
      ...groupedSettings.platform
    };

    // Debug logging untuk troubleshoot
    console.log('Payment settings before defaults:', groupedSettings.payment);
    console.log('All payment category settings:', settings?.filter(s => s.category === 'payment'));

    // Add default values for missing payment fields
    groupedSettings.payment = {
      minimum_donation: groupedSettings.payment.minimum_donation || groupedSettings.payment.min_donation_amount || 5000,
      maximum_donation: groupedSettings.payment.maximum_donation || groupedSettings.payment.max_donation_amount || 10000000,
      platform_fee_percentage: groupedSettings.payment.platform_fee_percentage || 5,
      predefined_amounts: groupedSettings.payment.predefined_amounts || [8338000, 16670000, 25003000, 33335000, 41668000, 50000000],
      duitku_sandbox_mode: groupedSettings.payment.duitku_sandbox_mode !== undefined ? groupedSettings.payment.duitku_sandbox_mode : true,
      ...groupedSettings.payment
    };
    
    console.log('Payment settings after defaults:', groupedSettings.payment);

    // Add default features
    groupedSettings.features = {
      user_registration: groupedSettings.features.user_registration !== undefined ? groupedSettings.features.user_registration : true,
      public_profiles: true,
      donation_goals: true,
      obs_integration: true,
      file_uploads: true,
      max_file_size_mb: 10,
      ...groupedSettings.features
    };

    // Add default security settings (only non-sensitive ones)
    groupedSettings.security = {
      require_email_verification: true,
      password_min_length: 8,
      ...groupedSettings.security
    };

    return NextResponse.json({
      success: true,
      data: groupedSettings,
    });
  } catch (error) {
    console.error('Public settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all relevant settings from database
    const { data: settings, error } = await supabaseAdmin
      .from('system_settings')
      .select('category, key, value, data_type')
      .in('category', ['platform', 'features', 'payment']);

    const defaultStatus = {
      maintenance_mode: false,
      maintenance_message: '',
      platform_name: 'SocialBuzz',
      features: {
        user_registration: true,
        public_profiles: true,
        file_uploads: true,
      }
    };

    if (error || !settings) {
      return NextResponse.json({
        success: true,
        data: defaultStatus,
      });
    }

    // Transform settings into structured object
    const settingsMap: any = {
      platform: {},
      features: {},
      payment: {}
    };

    settings.forEach((setting) => {
      let value = setting.value;
      
      // Parse value based on data_type
      try {
        switch (setting.data_type) {
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

      if (settingsMap[setting.category]) {
        settingsMap[setting.category][setting.key] = value;
      }
    });

    const systemStatus = {
      maintenance_mode: settingsMap.platform.maintenance_mode || false,
      maintenance_message: settingsMap.platform.maintenance_message || '',
      platform_name: settingsMap.platform.name || 'SocialBuzz',
      features: {
        user_registration: settingsMap.features.user_registration ?? true,
        public_profiles: settingsMap.features.public_profiles ?? true,
        file_uploads: settingsMap.features.file_uploads ?? true,
        max_file_size_mb: settingsMap.features.max_file_size_mb || 10,
        live_streaming: settingsMap.features.live_streaming ?? true,
        groups: settingsMap.features.groups ?? true,
        events: settingsMap.features.events ?? true,
        stories: settingsMap.features.stories ?? true,
      },
      payment: {
        minimum_donation: settingsMap.payment.minimum_donation || 5000,
        maximum_donation: settingsMap.payment.maximum_donation || 10000000,
        platform_fee_percentage: settingsMap.payment.platform_fee_percentage || 5,
      }
    };

    return NextResponse.json({
      success: true,
      data: systemStatus,
    });
  } catch (error) {
    console.error('System status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get system status',
    }, { status: 500 });
  }
}
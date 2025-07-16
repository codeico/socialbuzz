import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { clearPaymentSettingsCache } from '@/lib/paymentSettings';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (userError || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all settings from database
    const { data: settings, error } = await supabaseAdmin
      .from('system_settings')
      .select('category, key, value, type, description, is_public')
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
      email: {},
      security: {},
      features: {},
      social: {},
      notifications: {},
      general: {},
      contact: {},
      legal: {},
      payout: {}
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
        } else {
          // Store other general settings in their own category
          groupedSettings.general[setting.key] = value;
        }
      } else if (setting.category === 'payment') {
        if (setting.key === 'minimum_donation') {
          groupedSettings.payment.minimum_donation = value;
        } else if (setting.key === 'maximum_donation') {
          groupedSettings.payment.maximum_donation = value;
        } else if (setting.key === 'platform_fee_percentage') {
          groupedSettings.payment.platform_fee_percentage = value;
        } else if (setting.key === 'predefined_amounts') {
          groupedSettings.payment.predefined_amounts = value;
        }
      } else if (setting.category === 'payout') {
        if (setting.key === 'min_payout_amount') {
          groupedSettings.payment.auto_payout_threshold = value;
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

    // Add default values for missing payment fields
    groupedSettings.payment = {
      duitku_merchant_code: process.env.DUITKU_MERCHANT_CODE || '',
      duitku_api_key: process.env.DUITKU_API_KEY || '',
      duitku_sandbox_mode: process.env.DUITKU_BASE_URL?.includes('sandbox') || true,
      minimum_donation: groupedSettings.payment.minimum_donation || 5000,
      maximum_donation: groupedSettings.payment.maximum_donation || 10000000,
      platform_fee_percentage: groupedSettings.payment.platform_fee_percentage || 5,
      auto_payout_threshold: groupedSettings.payment.auto_payout_threshold || 100000,
      predefined_amounts: groupedSettings.payment.predefined_amounts || [8338000, 16670000, 25003000, 33335000, 41668000, 50000000],
      transaction_id_prefix: groupedSettings.payment.transaction_id_prefix || 'SB',
      ...groupedSettings.payment
    };

    // Add default email settings from environment
    groupedSettings.email = {
      smtp_host: process.env.SMTP_HOST || '',
      smtp_port: parseInt(process.env.SMTP_PORT || '587'),
      smtp_username: process.env.SMTP_USERNAME || '',
      smtp_password: process.env.SMTP_PASSWORD || '',
      smtp_secure: process.env.SMTP_SECURE === 'true',
      from_email: process.env.FROM_EMAIL || '',
      from_name: process.env.FROM_NAME || 'SocialBuzz',
    };

    // Add default security settings
    groupedSettings.security = {
      session_timeout: 24,
      max_login_attempts: 5,
      password_min_length: 8,
      require_email_verification: true,
      enable_2fa: false,
      jwt_secret_rotation_days: 30,
      ...groupedSettings.security
    };

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

    // Add default notification settings
    groupedSettings.notifications = {
      email_notifications: true,
      push_notifications: false,
      admin_email: process.env.ADMIN_EMAIL || '',
      webhook_url: process.env.WEBHOOK_URL || '',
    };

    return NextResponse.json({
      success: true,
      data: groupedSettings,
    });
  } catch (error) {
    console.error('Admin settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (userError || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await request.json();

    // Validate settings
    if (!settings.platform?.name || !settings.payment?.minimum_donation) {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    const updatedKeys = [];

    // Update each category of settings
    for (const [category, categorySettings] of Object.entries(settings)) {
      if (typeof categorySettings === 'object' && categorySettings !== null) {
        for (const [key, value] of Object.entries(categorySettings as Record<string, any>)) {
          // Skip email and notification settings as they're env-based
          if (category === 'email' || category === 'notifications') {
            continue;
          }

          // Map frontend keys to database keys and categories
          let dbKey = key;
          let dbCategory = category;
          
          // Handle platform mappings
          if (category === 'platform') {
            if (key === 'name') {
              dbKey = 'platform_name';
              dbCategory = 'general';
            } else if (key === 'description') {
              dbKey = 'platform_description';  
              dbCategory = 'general';
            } else if (key === 'maintenance_mode') {
              dbKey = 'maintenance_mode';
              dbCategory = 'general';
            } else if (key === 'maintenance_message') {
              dbKey = 'maintenance_message';
              dbCategory = 'general';
            } else if (key === 'logo_url') {
              dbKey = 'logo_url';
              dbCategory = 'general';
            } else if (key === 'primary_color') {
              dbKey = 'primary_color';
              dbCategory = 'general';
            } else if (key === 'secondary_color') {
              dbKey = 'secondary_color';
              dbCategory = 'general';
            }
          }

          // Handle features mappings
          if (category === 'features' && key === 'user_registration') {
            dbKey = 'allow_registration';
            dbCategory = 'general';
          }

          // Determine data type
          let dataType = 'string';
          let stringValue = String(value);

          if (typeof value === 'boolean') {
            dataType = 'boolean';
            stringValue = value ? 'true' : 'false';
          } else if (typeof value === 'number') {
            dataType = 'number';
            stringValue = String(value);
          } else if (typeof value === 'object') {
            dataType = 'json';
            stringValue = JSON.stringify(value);
          }

          // Use UPSERT to handle both create and update
          const { error } = await supabaseAdmin
            .from('system_settings')
            .upsert({
              key: dbKey,
              value: stringValue,
              category: dbCategory,
              type: dataType,
              description: `${dbCategory} ${dbKey} setting`,
              is_public: dbCategory === 'platform' || dbCategory === 'features' || dbCategory === 'general',
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'key'
            });

          if (error) {
            console.error(`Error upserting ${dbCategory}.${dbKey}:`, error);
          } else {
            updatedKeys.push(`${category}.${key} -> ${dbCategory}.${dbKey}`);
          }
        }
      }
    }

    // Clear payment settings cache if payment settings were updated
    if (updatedKeys.some(key => key.includes('payment.'))) {
      clearPaymentSettingsCache();
    }

    // Try to log the settings change (may fail if admin_logs table doesn't exist)
    try {
      await supabaseAdmin.from('admin_logs').insert({
        admin_id: decoded.userId,
        action: 'settings_update',
        details: {
          updated_keys: updatedKeys,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (logError) {
      console.warn('Could not log admin action:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      updated_keys: updatedKeys,
    });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

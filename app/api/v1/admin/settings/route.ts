import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

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

    // Get settings from database or return defaults
    const { data: settings, error } = await supabaseAdmin.from('system_settings').select('*').single();

    // Default settings if none exist
    const defaultSettings = {
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
        duitku_merchant_code: process.env.DUITKU_MERCHANT_CODE || '',
        duitku_api_key: process.env.DUITKU_API_KEY || '',
        duitku_sandbox_mode: process.env.DUITKU_SANDBOX === 'true',
        minimum_donation: 5000,
        maximum_donation: 10000000,
        platform_fee_percentage: 5,
        auto_payout_threshold: 100000,
      },
      email: {
        smtp_host: process.env.SMTP_HOST || '',
        smtp_port: parseInt(process.env.SMTP_PORT || '587'),
        smtp_username: process.env.SMTP_USERNAME || '',
        smtp_password: process.env.SMTP_PASSWORD || '',
        smtp_secure: process.env.SMTP_SECURE === 'true',
        from_email: process.env.FROM_EMAIL || '',
        from_name: process.env.FROM_NAME || 'SocialBuzz',
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
        admin_email: process.env.ADMIN_EMAIL || '',
        webhook_url: process.env.WEBHOOK_URL || '',
      },
    };

    const responseSettings = settings?.settings || defaultSettings;

    return NextResponse.json({
      success: true,
      data: responseSettings,
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

    // Check if settings record exists
    const { data: existingSettings } = await supabaseAdmin.from('system_settings').select('id').single();

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabaseAdmin
        .from('system_settings')
        .update({
          settings,
          updated_at: new Date().toISOString(),
          updated_by: decoded.userId,
        })
        .eq('id', existingSettings.id);

      if (error) {
        throw error;
      }
    } else {
      // Create new settings
      const { error } = await supabaseAdmin.from('system_settings').insert({
        settings,
        created_by: decoded.userId,
        updated_by: decoded.userId,
      });

      if (error) {
        throw error;
      }
    }

    // Log the settings change
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: decoded.userId,
      action: 'settings_update',
      details: {
        changed_sections: Object.keys(settings),
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

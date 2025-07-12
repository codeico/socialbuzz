import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

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

    const body = await request.json();
    const { notifications, privacy, bankAccount } = body;

    // Update user profile with settings
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        notification_settings: notifications,
        privacy_settings: privacy,
        bank_account: bankAccount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', decoded.userId)
      .select()
      .single();

    if (profileError) {
      // If profile doesn't exist, create it
      if (profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: decoded.userId,
            notification_settings: notifications,
            privacy_settings: privacy,
            bank_account: bankAccount,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return NextResponse.json({
          success: true,
          message: 'Settings saved successfully',
          data: newProfile,
        });
      }
      throw profileError;
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('notification_settings, privacy_settings, bank_account')
      .eq('user_id', decoded.userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Return default settings if profile doesn't exist
    const defaultSettings = {
      notification_settings: {
        email: true,
        push: true,
        donations: true,
        payouts: true,
        marketing: false,
      },
      privacy_settings: {
        profileVisible: true,
        showEarnings: true,
        showDonations: true,
      },
      bank_account: {
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
      },
    };

    return NextResponse.json({
      success: true,
      data: profile || defaultSettings,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

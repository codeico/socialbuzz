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

    // Update user settings (now all in users table)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .update({
        notification_settings: notifications,
        privacy_settings: privacy,
        bank_account: bankAccount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', decoded.userId)
      .select()
      .single();

    if (profileError) {
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

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('notification_settings, privacy_settings, bank_account')
      .eq('id', decoded.userId)
      .single();

    if (error) {
      throw error;
    }

    // Return user settings with defaults if needed
    const settings = {
      notification_settings: user.notification_settings || {
        email: true,
        push: true,
        donations: true,
        payouts: true,
        marketing: false,
      },
      privacy_settings: user.privacy_settings || {
        profileVisible: true,
        showEarnings: true,
        showDonations: true,
      },
      bank_account: user.bank_account || {
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
      },
    };

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Get user data (all profile info now in users table)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        email,
        username,
        full_name,
        avatar,
        bio,
        website,
        location,
        social_links,
        privacy_settings,
        notification_settings,
        bank_account,
        role,
        is_verified,
        balance,
        total_earnings,
        total_donations,
        created_at,
        updated_at
      `,
      )
      .eq('id', decoded.userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Format user data with defaults
    const fullProfile = {
      ...user,
      bio: user.bio || '',
      website: user.website || '',
      location: user.location || '',
      socialLinks: user.social_links || {
        twitter: '',
        instagram: '',
        youtube: '',
        tiktok: '',
      },
      privacySettings: user.privacy_settings || {
        profileVisible: true,
        showEarnings: true,
        showDonations: true,
      },
      notificationSettings: user.notification_settings || {
        email: true,
        push: true,
        donations: true,
        payouts: true,
        marketing: false,
      },
      bankAccount: user.bank_account || {
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
      },
    };

    return NextResponse.json({
      success: true,
      data: fullProfile,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
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

    const body = await request.json();
    const {
      fullName,
      avatar,
      bio,
      website,
      location,
      socialLinks,
      privacySettings,
      notificationSettings,
      bankAccount,
    } = body;

    // Update all user data in single table
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Add all fields to update data
    if (fullName !== undefined) {
      updateData.full_name = fullName;
    }
    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (website !== undefined) {
      updateData.website = website;
    }
    if (location !== undefined) {
      updateData.location = location;
    }
    if (socialLinks !== undefined) {
      updateData.social_links = socialLinks;
    }
    if (privacySettings !== undefined) {
      updateData.privacy_settings = privacySettings;
    }
    if (notificationSettings !== undefined) {
      updateData.notification_settings = notificationSettings;
    }
    if (bankAccount !== undefined) {
      updateData.bank_account = bankAccount;
    }

    // Update user in single query
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', decoded.userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint,
    });
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update profile',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 });
  }
}

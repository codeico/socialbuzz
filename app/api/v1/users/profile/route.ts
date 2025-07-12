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

    // Get user data with profile information
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        email,
        username,
        full_name,
        avatar,
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

    // Get user profile data (bio, social links, etc.)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select(
        `
        bio,
        website,
        location,
        social_links,
        privacy_settings,
        notification_settings,
        bank_account
      `,
      )
      .eq('user_id', decoded.userId)
      .single();

    // Combine user and profile data
    const fullProfile = {
      ...user,
      bio: profile?.bio || '',
      website: profile?.website || '',
      location: profile?.location || '',
      socialLinks: profile?.social_links || {
        twitter: '',
        instagram: '',
        youtube: '',
        tiktok: '',
      },
      privacySettings: profile?.privacy_settings || {
        profileVisible: true,
        showEarnings: true,
        showDonations: true,
      },
      notificationSettings: profile?.notification_settings || {
        email: true,
        push: true,
        donations: true,
        payouts: true,
        marketing: false,
      },
      bankAccount: profile?.bank_account || {
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

    // Update basic user info
    if (fullName !== undefined || avatar !== undefined) {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (fullName !== undefined) {
        updateData.full_name = fullName;
      }
      if (avatar !== undefined) {
        updateData.avatar = avatar;
      }

      const { error: userError } = await supabaseAdmin.from('users').update(updateData).eq('id', decoded.userId);

      if (userError) {
        throw userError;
      }
    }

    // Update profile data
    if (
      bio !== undefined ||
      website !== undefined ||
      location !== undefined ||
      socialLinks !== undefined ||
      privacySettings !== undefined ||
      notificationSettings !== undefined ||
      bankAccount !== undefined
    ) {
      const profileUpdateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (bio !== undefined) {
        profileUpdateData.bio = bio;
      }
      if (website !== undefined) {
        profileUpdateData.website = website;
      }
      if (location !== undefined) {
        profileUpdateData.location = location;
      }
      if (socialLinks !== undefined) {
        profileUpdateData.social_links = socialLinks;
      }
      if (privacySettings !== undefined) {
        profileUpdateData.privacy_settings = privacySettings;
      }
      if (notificationSettings !== undefined) {
        profileUpdateData.notification_settings = notificationSettings;
      }
      if (bankAccount !== undefined) {
        profileUpdateData.bank_account = bankAccount;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', decoded.userId)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .update(profileUpdateData)
          .eq('user_id', decoded.userId);

        if (profileError) {
          throw profileError;
        }
      } else {
        // Create new profile
        const { error: profileError } = await supabaseAdmin.from('user_profiles').insert({
          user_id: decoded.userId,
          ...profileUpdateData,
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          throw profileError;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}

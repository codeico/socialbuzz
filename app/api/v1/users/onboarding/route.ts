import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
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
    const { bio, category, socialLinks, bankAccount } = body;

    // Update user with onboarding data (now all in users table)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .update({
        bio: bio || '',
        social_links: socialLinks || {},
        bank_account: bankAccount || {},
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
      message: 'Onboarding completed successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
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

    // Get user's onboarding status and profile data (all in users table now)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        username,
        email,
        full_name,
        bio,
        social_links,
        bank_account
      `,
      )
      .eq('id', decoded.userId)
      .single();

    if (userError) {
      throw userError;
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
        },
        isOnboarded: !!(user.bio || user.social_links || user.bank_account), // User is onboarded if they have profile data
        profile: {
          bio: user.bio || '',
          social_links: user.social_links || {},
          bank_account: user.bank_account || {},
        },
      },
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding status' }, { status: 500 });
  }
}

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

    // Update user profile with onboarding data
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: decoded.userId,
        bio: bio || '',
        social_links: socialLinks || {},
        bank_account: bankAccount || {},
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    // No need to update users table since onboarding status is determined by profile existence

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

    // Get user's onboarding status and profile data
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        username,
        email,
        full_name
      `,
      )
      .eq('id', decoded.userId)
      .single();

    if (userError) {
      throw userError;
    }

    // Get profile data separately
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('bio, social_links, bank_account')
      .eq('user_id', decoded.userId)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        user,
        isOnboarded: !!profile, // User is onboarded if they have a profile
        profile: profile || null,
      },
    });
  } catch (error) {
    console.error('Onboarding status error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding status' }, { status: 500 });
  }
}

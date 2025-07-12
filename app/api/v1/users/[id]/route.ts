import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get user profile with all related data
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        username,
        email,
        full_name,
        avatar_url,
        is_verified,
        is_onboarded,
        role,
        created_at,
        user_profiles (
          bio,
          category,
          social_links,
          bank_account
        ),
        user_stats (
          total_donations,
          total_supporters,
          avg_donation_amount,
          last_donation_at
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw error;
    }

    // Transform data to match expected format
    const transformedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.full_name || user.username,
      avatar: user.avatar_url || '/default-avatar.png',
      isVerified: user.is_verified,
      isOnboarded: user.is_onboarded,
      role: user.role,
      profile: user.user_profiles?.[0] || null,
      stats: user.user_stats?.[0] || {
        total_donations: 0,
        total_supporters: 0,
        avg_donation_amount: 0,
        last_donation_at: null,
      },
      joinedAt: user.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
    });
  } catch (error) {
    console.error('User profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

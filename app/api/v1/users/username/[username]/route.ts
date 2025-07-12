import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Get user profile by username with all related data
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        username,
        email,
        full_name,
        avatar,
        is_verified,
        role,
        balance,
        total_earnings,
        total_donations,
        created_at
      `)
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Get user profile data separately
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('bio, website, location, social_links, bank_account')
      .eq('user_id', user.id)
      .single();

    // Get supporter count from donations
    const { count: supporterCount } = await supabaseAdmin
      .from('donations')
      .select('donor_id', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .neq('donor_id', user.id); // Exclude self-donations

    // Transform data to match expected format
    const transformedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.full_name || user.username,
      avatar: user.avatar || '/default-avatar.png',
      isVerified: user.is_verified,
      isOnboarded: !!profile, // User is onboarded if they have a profile
      role: user.role,
      profile: profile ? {
        bio: profile.bio || '',
        category: 'general', // Default category since it's not in the schema
        social_links: profile.social_links || {},
        bank_account: profile.bank_account || {},
      } : null,
      stats: {
        total_donations: user.total_donations || 0,
        total_supporters: supporterCount || 0,
        avg_donation_amount: supporterCount > 0 ? (user.total_donations || 0) / supporterCount : 0,
        last_donation_at: null, // We would need to query this from donations table
      },
      joinedAt: user.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
    });
  } catch (error) {
    console.error('User profile fetch error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch user profile',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
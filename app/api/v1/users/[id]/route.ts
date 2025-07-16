import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    let actualUserId = id;

    // First, check if this is a payment link UUID
    const { data: paymentLink, error: linkError } = await supabaseAdmin
      .from('payment_links')
      .select('creator_id, expires_at')
      .eq('uuid', id)
      .single();

    if (paymentLink && !linkError) {
      // Check if the link is expired
      const expiresAt = new Date(paymentLink.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Payment link has expired' },
          { status: 410 }
        );
      }
      actualUserId = paymentLink.creator_id;
    }

    // Get user profile (all data now in users table)
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        username,
        email,
        full_name,
        avatar,
        bio,
        website,
        location,
        social_links,
        bank_account,
        is_verified,
        role,
        total_donations,
        total_earnings,
        created_at
      `,
      )
      .eq('id', actualUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw error;
    }

    // Get supporter count from transactions
    const { data: transactions } = await supabaseAdmin
      .from('transactions')
      .select('user_id')
      .eq('recipient_id', user.id)
      .eq('type', 'donation')
      .eq('status', 'completed')
      .neq('user_id', user.id); // Exclude self-donations

    // Count unique supporters
    const uniqueSupporters = new Set(transactions?.map(t => t.user_id).filter(Boolean));
    const supporterCount = uniqueSupporters.size;

    // Transform data to match expected format
    const transformedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.full_name || user.username,
      avatar: user.avatar || '/default-avatar.png',
      isVerified: user.is_verified,
      isOnboarded: !!(user.bio || user.website || user.location),
      role: user.role,
      profile: {
        bio: user.bio || '',
        category: 'general',
        social_links: user.social_links || {},
        bank_account: user.bank_account || {},
      },
      stats: {
        total_donations: user.total_donations || 0,
        total_supporters: supporterCount,
        avg_donation_amount: supporterCount > 0 ? (user.total_donations || 0) / supporterCount : 0,
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

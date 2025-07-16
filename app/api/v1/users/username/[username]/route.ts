import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    // Get user profile by username (all data now in users table)
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
        balance,
        total_earnings,
        total_donations,
        created_at
      `,
      )
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw error;
    }

    // Get supporter count and total donations from donations table
    const { data: donations } = await supabaseAdmin
      .from('donations')
      .select('donor_email, donor_name, amount')
      .eq('recipient_id', user.id)
      .eq('payment_status', 'paid');

    // Count unique supporters based on donor_email or donor_name
    const uniqueSupporters = new Set();
    let totalDonations = 0;
    
    donations?.forEach(donation => {
      totalDonations += donation.amount;
      const identifier = donation.donor_email || donation.donor_name;
      if (identifier) {
        uniqueSupporters.add(identifier);
      }
    });
    
    const supporterCount = uniqueSupporters.size;

    // Get last donation date
    const { data: lastDonation } = await supabaseAdmin
      .from('donations')
      .select('created_at')
      .eq('recipient_id', user.id)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Transform data to match expected format
    const transformedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.full_name || user.username,
      avatar: user.avatar || '/default-avatar.png',
      isVerified: user.is_verified,
      isOnboarded: !!(user.bio || user.website || user.location), // User is onboarded if they have profile data
      role: user.role,
      location: user.location || '',
      website: user.website || '',
      profile: {
        bio: user.bio || '',
        category: 'general', // Default category since it's not in the schema
        social_links: user.social_links || {},
        bank_account: user.bank_account || {},
      },
      stats: {
        total_donations: totalDonations || 0,
        total_supporters: supporterCount || 0,
        avg_donation_amount: (supporterCount || 0) > 0 ? Math.round(totalDonations / supporterCount) : 0,
        last_donation_at: lastDonation?.created_at || null,
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
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      details: (error as any)?.details,
      hint: (error as any)?.hint,
    });
    return NextResponse.json(
      {
        error: 'Failed to fetch user profile',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
      },
      { status: 500 },
    );
  }
}

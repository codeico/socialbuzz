import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort') || 'popular';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('users')
      .select(
        `
        id,
        username,
        full_name,
        avatar,
        is_verified,
        role,
        total_earnings,
        total_donations,
        created_at
      `,
      )
      .eq('role', 'user') // Change from 'creator' to 'user' since that's the default role
      .range(offset, offset + limit - 1);

    // Search by username or full name if specified
    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    // Sort creators
    switch (sortBy) {
    case 'popular':
      query = query.order('total_donations', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'earnings':
      query = query.order('total_earnings', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
    }

    const { data: creators, error, count } = await query;

    if (error) {
      throw error;
    }

    // Transform data to match expected format
    const transformedCreators = await Promise.all(
      creators?.map(async creator => {
        // Get supporter count for each creator
        const { count: supporterCount } = await supabaseAdmin
          .from('donations')
          .select('donor_id', { count: 'exact', head: true })
          .eq('recipient_id', creator.id);

        // Get profile data
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('bio, social_links')
          .eq('user_id', creator.id)
          .single();

        return {
          id: creator.id,
          username: creator.username,
          displayName: creator.full_name || creator.username,
          avatar: creator.avatar || '/default-avatar.png',
          bio: profile?.bio || '',
          category: 'general', // Default category
          isVerified: creator.is_verified,
          stats: {
            totalDonations: creator.total_donations || 0,
            totalSupporters: supporterCount || 0,
            avgDonationAmount: (supporterCount || 0) > 0 ? (creator.total_donations || 0) / (supporterCount || 0) : 0,
            lastDonationAt: null,
          },
          socialLinks: profile?.social_links || {},
          joinedAt: creator.created_at,
        };
      }) || [],
    );

    return NextResponse.json({
      success: true,
      data: transformedCreators,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Creators fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch creators' }, { status: 500 });
  }
}

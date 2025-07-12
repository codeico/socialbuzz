import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get donations for this user
    const { data: donations, error, count } = await supabaseAdmin
      .from('donations')
      .select(`
        id,
        amount,
        message,
        is_anonymous,
        created_at,
        supporter_name,
        supporter_email
      `, { count: 'exact' })
      .eq('creator_id', id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Transform donations data
    const transformedDonations = donations?.map(donation => ({
      id: donation.id,
      amount: donation.amount,
      message: donation.message || '',
      isAnonymous: donation.is_anonymous,
      supporterName: donation.is_anonymous ? 'Anonymous' : donation.supporter_name,
      supporterEmail: donation.is_anonymous ? null : donation.supporter_email,
      createdAt: donation.created_at,
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedDonations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('User donations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user donations' },
      { status: 500 }
    );
  }
}
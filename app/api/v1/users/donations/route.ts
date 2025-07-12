import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withAuth } from '@/lib/middleware';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export const GET = withAuth(async req => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('donations')
      .select(
        `
        *,
        donor:users!donations_donor_id_fkey(
          id,
          username,
          full_name,
          avatar
        ),
        recipient:users!donations_recipient_id_fkey(
          id,
          username,
          full_name,
          avatar
        )
      `,
        { count: 'exact' },
      )
      .eq('recipient_id', req.user.userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching donations:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch donations' }, { status: 500 });
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        data: data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
});

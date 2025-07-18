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

    // Check if user is admin
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (userError || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('payout_requests')
      .select(
        `
        *,
        user:users!payout_requests_user_id_fkey (
          username,
          full_name,
          email,
          balance
        ),
        processor:users!payout_requests_processed_by_fkey (
          username,
          full_name
        )
      `,
        { count: 'exact' },
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      // Note: Advanced filtering with joins might need to be handled differently
      // For now, we'll get all data and filter after
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: payouts, error, count } = await query;

    if (error) {
      throw error;
    }

    // Transform data to match frontend expectations
    const transformedPayouts = (payouts || []).map(payout => ({
      ...payout,
      bank_account: payout.bank_details || {},
      notes: payout.admin_notes
    }));

    return NextResponse.json({
      success: true,
      data: transformedPayouts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
  }
}

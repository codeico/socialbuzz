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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('date_range');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('transactions')
      .select(
        `
        *,
        user:users!transactions_user_id_fkey (
          username,
          full_name,
          email
        ),
        recipient:users!transactions_recipient_id_fkey (
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
      query = query.or(`merchant_order_id.ilike.%${search}%,reference.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
      }

      query = query.gte('created_at', startDate.toISOString());
    }

    const { data: transactions, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: transactions || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Admin transactions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

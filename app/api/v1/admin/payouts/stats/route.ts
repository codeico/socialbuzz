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

    // Get total requests
    const { count: totalRequests } = await supabaseAdmin
      .from('payout_requests')
      .select('*', { count: 'exact', head: true });

    // Get total amount
    const { data: totalAmountData } = await supabaseAdmin.from('payout_requests').select('amount');

    const totalAmount = totalAmountData?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Get pending requests
    const { count: pendingRequests } = await supabaseAdmin
      .from('payout_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get pending amount
    const { data: pendingAmountData } = await supabaseAdmin
      .from('payout_requests')
      .select('amount')
      .eq('status', 'pending');

    const pendingAmount = pendingAmountData?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Get completed requests
    const { count: completedRequests } = await supabaseAdmin
      .from('payout_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get completed amount
    const { data: completedAmountData } = await supabaseAdmin
      .from('payout_requests')
      .select('amount')
      .eq('status', 'completed');

    const completedAmount = completedAmountData?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Get rejected requests
    const { count: rejectedRequests } = await supabaseAdmin
      .from('payout_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    const stats = {
      totalRequests: totalRequests || 0,
      totalAmount,
      pendingRequests: pendingRequests || 0,
      pendingAmount,
      completedRequests: completedRequests || 0,
      completedAmount,
      rejectedRequests: rejectedRequests || 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payout stats' }, { status: 500 });
  }
}

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

    // Get total transactions
    const { count: totalTransactions } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Get total amount
    const { data: totalAmountData } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('status', 'completed');

    const totalAmount = totalAmountData?.reduce((sum, t) => sum + t.amount, 0) || 0;

    // Get pending transactions
    const { count: pendingTransactions } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get failed transactions
    const { count: failedTransactions } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    // Get completed transactions
    const { count: completedTransactions } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get today's amount
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayAmountData } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', today.toISOString());

    const todayAmount = todayAmountData?.reduce((sum, t) => sum + t.amount, 0) || 0;

    const stats = {
      totalTransactions: totalTransactions || 0,
      totalAmount,
      pendingTransactions: pendingTransactions || 0,
      failedTransactions: failedTransactions || 0,
      completedTransactions: completedTransactions || 0,
      todayAmount,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Admin transaction stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction stats' },
      { status: 500 }
    );
  }
}
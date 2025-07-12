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

    // Get current date for today's stats
    const today = new Date().toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get users from last month for growth calculation
    const { count: usersLastMonth } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .lte('created_at', lastMonth);

    // Get total transactions and revenue
    const { data: transactionStats } = await supabaseAdmin
      .from('transactions')
      .select('amount, fee_amount, created_at, status')
      .eq('status', 'completed');

    const totalRevenue = transactionStats?.reduce((sum, t) => sum + (t.fee_amount || 0), 0) || 0;
    const totalTransactions = transactionStats?.length || 0;

    // Get today's stats
    const { data: todayTransactions } = await supabaseAdmin
      .from('transactions')
      .select('amount, fee_amount')
      .eq('status', 'completed')
      .gte('created_at', today);

    const todayRevenue = todayTransactions?.reduce((sum, t) => sum + (t.fee_amount || 0), 0) || 0;
    const todayTransactionCount = todayTransactions?.length || 0;

    // Get revenue from last month for growth calculation
    const { data: lastMonthTransactions } = await supabaseAdmin
      .from('transactions')
      .select('fee_amount')
      .eq('status', 'completed')
      .lte('created_at', lastMonth);

    const revenueLastMonth = lastMonthTransactions?.reduce((sum, t) => sum + (t.fee_amount || 0), 0) || 0;

    // Get pending payouts
    const { count: pendingPayouts } = await supabaseAdmin
      .from('payout_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Calculate growth percentages
    const userGrowth = usersLastMonth ? ((totalUsers - usersLastMonth) / usersLastMonth) * 100 : 0;
    const revenueGrowth = revenueLastMonth ? ((totalRevenue - revenueLastMonth) / revenueLastMonth) * 100 : 0;

    // Get recent activity
    const { data: recentUsers } = await supabaseAdmin
      .from('users')
      .select('id, username, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentTransactions } = await supabaseAdmin
      .from('transactions')
      .select(`
        id, amount, created_at, type,
        users!user_id(username, full_name)
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentPayouts } = await supabaseAdmin
      .from('payout_requests')
      .select(`
        id, amount, created_at,
        users(username, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(2);

    // Format recent activity
    const recentActivity = [];

    // Add recent users
    recentUsers?.forEach(user => {
      recentActivity.push({
        id: `user_${user.id}`,
        type: 'user_registered',
        user: user.full_name || user.username,
        timestamp: user.created_at,
      });
    });

    // Add recent transactions
    recentTransactions?.forEach(transaction => {
      recentActivity.push({
        id: `transaction_${transaction.id}`,
        type: 'transaction_completed',
        user: transaction.users?.full_name || transaction.users?.username || 'Unknown',
        amount: transaction.amount,
        timestamp: transaction.created_at,
      });
    });

    // Add recent payouts
    recentPayouts?.forEach(payout => {
      recentActivity.push({
        id: `payout_${payout.id}`,
        type: 'payout_requested',
        user: payout.users?.full_name || payout.users?.username || 'Unknown',
        amount: payout.amount,
        timestamp: payout.created_at,
      });
    });

    // Sort by timestamp
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const stats = {
      totalUsers: totalUsers || 0,
      totalRevenue: Math.round(totalRevenue),
      totalTransactions: totalTransactions,
      pendingPayouts: pendingPayouts || 0,
      todayRevenue: Math.round(todayRevenue),
      todayTransactions: todayTransactionCount,
      userGrowth: Math.round(userGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentActivity: recentActivity.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
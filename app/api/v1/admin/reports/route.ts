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
    const days = parseInt(searchParams.get('days') || '30');
    const type = searchParams.get('type') || 'overview';

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    // Calculate previous period for growth comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);
    const prevEndDate = new Date(startDate);

    // Get current period stats
    const currentStats = await getStats(startDate.toISOString(), endDate.toISOString());
    const previousStats = await getStats(prevStartDate.toISOString(), prevEndDate.toISOString());

    // Calculate growth percentages
    const revenueGrowth = calculateGrowth(currentStats.totalRevenue, previousStats.totalRevenue);
    const userGrowth = calculateGrowth(currentStats.totalUsers, previousStats.totalUsers);
    const transactionGrowth = calculateGrowth(currentStats.totalTransactions, previousStats.totalTransactions);

    const stats = {
      ...currentStats,
      revenueGrowth,
      userGrowth,
      transactionGrowth,
    };

    // Get additional data based on type
    const additionalData: any = {};

    if (type === 'overview' || type === 'revenue') {
      additionalData.revenueData = await getRevenueData(startDate.toISOString(), endDate.toISOString());
    }

    if (type === 'overview' || type === 'creators') {
      additionalData.topCreators = await getTopCreators(startDate.toISOString(), endDate.toISOString());
    }

    if (type === 'overview' || type === 'users') {
      additionalData.topDonors = await getTopDonors(startDate.toISOString(), endDate.toISOString());
    }

    if (type === 'overview' || type === 'transactions') {
      additionalData.transactionTrends = await getTransactionTrends(startDate.toISOString(), endDate.toISOString());
    }

    return NextResponse.json({
      success: true,
      data: {
        stats,
        ...additionalData,
      },
    });
  } catch (error) {
    console.error('Admin reports error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

async function getStats(startDate: string, endDate: string) {
  // Total revenue from completed transactions
  const { data: revenueData } = await supabaseAdmin
    .from('transactions')
    .select('amount')
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const totalRevenue = revenueData?.reduce((sum, t) => sum + t.amount, 0) || 0;

  // Total transactions
  const { count: totalTransactions } = await supabaseAdmin
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  // Total users
  const { count: totalUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  // Total creators (users with earnings)
  const { count: totalCreators } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gt('total_earnings', 0)
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  // Average transaction amount
  const averageTransactionAmount = totalTransactions && totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Success rate
  const { count: completedTransactions } = await supabaseAdmin
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const successRate =
    totalTransactions && totalTransactions > 0 ? ((completedTransactions || 0) / totalTransactions) * 100 : 0;

  return {
    totalRevenue,
    totalTransactions: totalTransactions || 0,
    totalUsers: totalUsers || 0,
    totalCreators: totalCreators || 0,
    averageTransactionAmount,
    successRate,
  };
}

async function getRevenueData(startDate: string, endDate: string) {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select('amount, created_at')
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .order('created_at', { ascending: true });

  // Group by date
  const revenueByDate: { [key: string]: { revenue: number; transactions: number } } = {};

  data?.forEach(transaction => {
    const date = transaction.created_at.split('T')[0];
    if (!revenueByDate[date]) {
      revenueByDate[date] = { revenue: 0, transactions: 0 };
    }
    revenueByDate[date].revenue += transaction.amount;
    revenueByDate[date].transactions += 1;
  });

  return Object.entries(revenueByDate).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    transactions: data.transactions,
  }));
}

async function getTopCreators(startDate: string, endDate: string) {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select(
      `
      recipient_id,
      amount,
      recipient:users!transactions_recipient_id_fkey (
        username,
        full_name,
        total_earnings
      )
    `,
    )
    .eq('status', 'completed')
    .eq('type', 'donation')
    .not('recipient_id', 'is', null)
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  // Group by recipient
  const creatorStats: { [key: string]: any } = {};

  data?.forEach(transaction => {
    const recipientId = transaction.recipient_id;
    if (!creatorStats[recipientId]) {
      creatorStats[recipientId] = {
        id: recipientId,
        username: (transaction.recipient as any)?.username || 'unknown',
        full_name: (transaction.recipient as any)?.full_name || 'Unknown',
        total_earnings: 0,
        donation_count: 0,
      };
    }
    creatorStats[recipientId].total_earnings += transaction.amount;
    creatorStats[recipientId].donation_count += 1;
  });

  return Object.values(creatorStats)
    .sort((a: any, b: any) => b.total_earnings - a.total_earnings)
    .slice(0, 10);
}

async function getTopDonors(startDate: string, endDate: string) {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select(
      `
      user_id,
      amount,
      user:users!transactions_user_id_fkey (
        username,
        full_name,
        total_donations
      )
    `,
    )
    .eq('status', 'completed')
    .eq('type', 'donation')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  // Group by user
  const donorStats: { [key: string]: any } = {};

  data?.forEach(transaction => {
    const userId = transaction.user_id;
    if (!donorStats[userId]) {
      donorStats[userId] = {
        id: userId,
        username: (transaction.user as any)?.username || 'unknown',
        full_name: (transaction.user as any)?.full_name || 'Unknown',
        total_donations: 0,
        donation_count: 0,
      };
    }
    donorStats[userId].total_donations += transaction.amount;
    donorStats[userId].donation_count += 1;
  });

  return Object.values(donorStats)
    .sort((a: any, b: any) => b.total_donations - a.total_donations)
    .slice(0, 10);
}

async function getTransactionTrends(startDate: string, endDate: string) {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select('status, amount')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  // Group by status
  const statusStats: { [key: string]: { count: number; amount: number } } = {};
  let totalCount = 0;

  data?.forEach(transaction => {
    const status = transaction.status;
    if (!statusStats[status]) {
      statusStats[status] = { count: 0, amount: 0 };
    }
    statusStats[status].count += 1;
    statusStats[status].amount += transaction.amount;
    totalCount += 1;
  });

  return Object.entries(statusStats).map(([status, stats]) => ({
    status,
    count: stats.count,
    amount: stats.amount,
    percentage: totalCount > 0 ? (stats.count / totalCount) * 100 : 0,
  }));
}

function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

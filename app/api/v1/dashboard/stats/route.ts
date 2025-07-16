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

    const userId = decoded.userId;

    // Parallel queries for better performance
    const [
      userResult,
      recentTransactionsResult,
      recentDonationsResult,
      statsResult
    ] = await Promise.allSettled([
      // Basic user info
      supabaseAdmin
        .from('users')
        .select('id, email, username, full_name, avatar, role, is_verified, balance, total_earnings, total_donations')
        .eq('id', userId)
        .single(),

      // Recent transactions (limited, no heavy joins)
      supabaseAdmin
        .from('transactions')
        .select('id, type, amount, description, status, created_at')
        .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(5),

      // Recent donations received (simplified)
      supabaseAdmin
        .from('transactions')
        .select('id, amount, message, status, created_at, metadata')
        .eq('recipient_id', userId)
        .eq('type', 'donation')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5),

      // Monthly stats (this month)
      supabaseAdmin
        .from('transactions')
        .select('amount')
        .eq('recipient_id', userId)
        .eq('status', 'completed')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    ]);

    // Handle user data
    if (userResult.status === 'rejected' || userResult.value.error) {
      console.error('User fetch error:', userResult.status === 'rejected' ? userResult.reason : userResult.value.error);
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = userResult.value.data;

    // Handle recent transactions
    const recentTransactions = recentTransactionsResult.status === 'fulfilled' && !recentTransactionsResult.value.error
      ? recentTransactionsResult.value.data || []
      : [];

    // Handle recent donations
    const recentDonations = recentDonationsResult.status === 'fulfilled' && !recentDonationsResult.value.error
      ? recentDonationsResult.value.data || []
      : [];

    // Calculate monthly earnings
    let monthlyEarnings = 0;
    if (statsResult.status === 'fulfilled' && !statsResult.value.error) {
      const monthlyTransactions = statsResult.value.data || [];
      monthlyEarnings = monthlyTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    }

    // Process recent donations to include donor names from metadata
    const processedDonations = recentDonations.map(donation => ({
      ...donation,
      donorName: donation.metadata?.isAnonymous ? 'Anonymous' : (donation.metadata?.donorName || 'Anonymous')
    }));

    return NextResponse.json({
      success: true,
      data: {
        user,
        stats: {
          balance: user.balance || 0,
          totalEarnings: user.total_earnings || 0,
          totalDonations: user.total_donations || 0,
          monthlyEarnings
        },
        recentTransactions,
        recentDonations: processedDonations
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
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
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get total users
    const { count: totalUsers } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true });

    // Get new users in period
    const { count: newUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Get total creators
    const { count: totalCreators } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'creator');

    // Get active creators (creators who received donations in period)
    const { data: activeCreatorIds } = await supabaseAdmin
      .from('transactions')
      .select('recipient_id')
      .eq('type', 'donation')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString());

    const activeCreators = new Set(activeCreatorIds?.map(d => d.recipient_id)).size;

    // Get total donations
    const { data: totalDonationsData } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('type', 'donation')
      .eq('status', 'completed');

    const totalDonations = totalDonationsData?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const totalDonationCount = totalDonationsData?.length || 0;

    // Get donations in period
    const { data: periodDonationsData } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('type', 'donation')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString());

    const periodDonations = periodDonationsData?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const periodDonationCount = periodDonationsData?.length || 0;

    // Get top creators by donations
    const { data: topCreators } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        username,
        full_name,
        avatar,
        total_donations,
        total_earnings
      `,
      )
      .eq('role', 'user')
      .order('total_donations', { ascending: false })
      .limit(10);

    // Get recent donations with recipient info
    const { data: recentDonations } = await supabaseAdmin
      .from('transactions')
      .select(
        `
        id,
        amount,
        message,
        user_id,
        recipient_id,
        metadata,
        created_at
      `,
      )
      .eq('type', 'donation')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(20);

    // Get daily analytics for the period
    const dailyAnalytics = [];
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const { count: dayUsers } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

      const { data: dayDonations } = await supabaseAdmin
        .from('transactions')
        .select('amount')
        .eq('type', 'donation')
        .eq('status', 'completed')
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

      const dayRevenue = dayDonations?.reduce((sum, d) => sum + d.amount, 0) || 0;

      dailyAnalytics.push({
        date: startOfDay.toISOString().split('T')[0],
        users: dayUsers || 0,
        donations: dayDonations?.length || 0,
        revenue: dayRevenue,
      });
    }

    const analytics = {
      overview: {
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        totalCreators: totalCreators || 0,
        activeCreators,
        totalDonations,
        totalDonationCount,
        periodDonations,
        periodDonationCount,
        averageDonation: totalDonationCount > 0 ? totalDonations / totalDonationCount : 0,
      },
      topCreators: await Promise.all(
        topCreators?.map(async creator => {
          // Get supporter count for each creator
          const { count: supporterCount } = await supabaseAdmin
            .from('transactions')
            .select('user_id', { count: 'exact', head: true })
            .eq('recipient_id', creator.id)
            .eq('type', 'donation')
            .eq('status', 'completed');

          return {
            id: creator.id,
            username: creator.username,
            displayName: creator.full_name || creator.username,
            avatar: creator.avatar || '/default-avatar.png',
            totalDonations: creator.total_donations || 0,
            totalSupporters: supporterCount || 0,
          };
        }) || [],
      ),
      recentDonations: await Promise.all(
        recentDonations?.map(async donation => {
          // Get donor and recipient info
          const { data: donor } = await supabaseAdmin
            .from('users')
            .select('username, full_name')
            .eq('id', donation.user_id)
            .single();

          const { data: recipient } = await supabaseAdmin
            .from('users')
            .select('username, full_name, avatar')
            .eq('id', donation.recipient_id)
            .single();

          return {
            id: donation.id,
            amount: donation.amount,
            message: donation.message,
            supporterName: donor?.full_name || donor?.username || 'Unknown',
            isAnonymous: false,
            createdAt: donation.created_at,
            creator: {
              username: recipient?.username || 'unknown',
              displayName: recipient?.full_name || recipient?.username || 'Unknown',
              avatar: recipient?.avatar || '/default-avatar.png',
            },
          };
        }) || [],
      ),
      dailyAnalytics,
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

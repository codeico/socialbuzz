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

    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get verified users
    const { count: verifiedUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true);

    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: newUsersToday } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: activeUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', thirtyDaysAgo.toISOString());

    const stats = {
      totalUsers: totalUsers || 0,
      verifiedUsers: verifiedUsers || 0,
      newUsersToday: newUsersToday || 0,
      activeUsers: activeUsers || 0,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Admin user stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
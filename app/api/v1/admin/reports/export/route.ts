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

    let csvData = '';

    switch (type) {
    case 'revenue':
      csvData = await generateRevenueReport(startDate.toISOString(), endDate.toISOString());
      break;
    case 'users':
      csvData = await generateUsersReport(startDate.toISOString(), endDate.toISOString());
      break;
    case 'transactions':
      csvData = await generateTransactionsReport(startDate.toISOString(), endDate.toISOString());
      break;
    case 'creators':
      csvData = await generateCreatorsReport(startDate.toISOString(), endDate.toISOString());
      break;
    default:
      csvData = await generateOverviewReport(startDate.toISOString(), endDate.toISOString());
    }

    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}-report-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export report' }, { status: 500 });
  }
}

async function generateRevenueReport(startDate: string, endDate: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select(
      `
      id,
      amount,
      currency,
      status,
      type,
      created_at,
      user:users!transactions_user_id_fkey (username, full_name),
      recipient:users!transactions_recipient_id_fkey (username, full_name)
    `,
    )
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .order('created_at', { ascending: false });

  let csv = 'Date,Transaction ID,Type,Amount,Currency,From User,To User\n';

  data?.forEach(transaction => {
    const date = new Date(transaction.created_at).toISOString().split('T')[0];
    const fromUser = (transaction.user as any)?.username || 'Unknown';
    const toUser = (transaction.recipient as any)?.username || 'N/A';

    csv += `${date},${transaction.id},${transaction.type},${transaction.amount},${transaction.currency},${fromUser},${toUser}\n`;
  });

  return csv;
}

async function generateUsersReport(startDate: string, endDate: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('users')
    .select(
      'id, username, email, full_name, role, balance, total_earnings, total_donations, is_verified, created_at, last_login',
    )
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .order('created_at', { ascending: false });

  let csv =
    'User ID,Username,Email,Full Name,Role,Balance,Total Earnings,Total Donations,Verified,Created Date,Last Login\n';

  data?.forEach(user => {
    const createdDate = new Date(user.created_at).toISOString().split('T')[0];
    const lastLogin = user.last_login ? new Date(user.last_login).toISOString().split('T')[0] : 'Never';

    csv += `${user.id},${user.username},${user.email},"${user.full_name}",${user.role},${user.balance},${user.total_earnings},${user.total_donations},${user.is_verified},${createdDate},${lastLogin}\n`;
  });

  return csv;
}

async function generateTransactionsReport(startDate: string, endDate: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select(
      `
      id,
      type,
      amount,
      currency,
      status,
      payment_method,
      reference_id,
      created_at,
      completed_at,
      user:users!transactions_user_id_fkey (username, email),
      recipient:users!transactions_recipient_id_fkey (username, email)
    `,
    )
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .order('created_at', { ascending: false });

  let csv =
    'Transaction ID,Type,Amount,Currency,Status,Payment Method,Reference ID,Created Date,Completed Date,From User,From Email,To User,To Email\n';

  data?.forEach(transaction => {
    const createdDate = new Date(transaction.created_at).toISOString().split('T')[0];
    const completedDate = transaction.completed_at
      ? new Date(transaction.completed_at).toISOString().split('T')[0]
      : 'N/A';
    const fromUser = (transaction.user as any)?.username || 'Unknown';
    const fromEmail = (transaction.user as any)?.email || 'Unknown';
    const toUser = (transaction.recipient as any)?.username || 'N/A';
    const toEmail = (transaction.recipient as any)?.email || 'N/A';

    csv += `${transaction.id},${transaction.type},${transaction.amount},${transaction.currency},${transaction.status},${transaction.payment_method || 'N/A'},${transaction.reference_id || 'N/A'},${createdDate},${completedDate},${fromUser},${fromEmail},${toUser},${toEmail}\n`;
  });

  return csv;
}

async function generateCreatorsReport(startDate: string, endDate: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('users')
    .select('id, username, email, full_name, total_earnings, total_donations, balance, is_verified, created_at')
    .gt('total_earnings', 0)
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .order('total_earnings', { ascending: false });

  let csv =
    'Creator ID,Username,Email,Full Name,Total Earnings,Total Donations Made,Current Balance,Verified,Created Date\n';

  data?.forEach(creator => {
    const createdDate = new Date(creator.created_at).toISOString().split('T')[0];

    csv += `${creator.id},${creator.username},${creator.email},"${creator.full_name}",${creator.total_earnings},${creator.total_donations},${creator.balance},${creator.is_verified},${createdDate}\n`;
  });

  return csv;
}

async function generateOverviewReport(startDate: string, endDate: string): Promise<string> {
  // Get summary statistics
  const { count: totalUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const { count: totalTransactions } = await supabaseAdmin
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const { data: revenueData } = await supabaseAdmin
    .from('transactions')
    .select('amount')
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const totalRevenue = revenueData?.reduce((sum, t) => sum + t.amount, 0) || 0;

  const { count: completedTransactions } = await supabaseAdmin
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const successRate =
    totalTransactions && totalTransactions > 0
      ? (((completedTransactions || 0) / totalTransactions) * 100).toFixed(2)
      : '0.00';

  const averageTransaction =
    totalTransactions && totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : '0.00';

  let csv = 'Metric,Value\n';
  csv += `Period Start,${startDate.split('T')[0]}\n`;
  csv += `Period End,${endDate.split('T')[0]}\n`;
  csv += `Total Users,${totalUsers || 0}\n`;
  csv += `Total Transactions,${totalTransactions || 0}\n`;
  csv += `Total Revenue,${totalRevenue}\n`;
  csv += `Completed Transactions,${completedTransactions || 0}\n`;
  csv += `Success Rate,${successRate}%\n`;
  csv += `Average Transaction,${averageTransaction}\n`;

  return csv;
}

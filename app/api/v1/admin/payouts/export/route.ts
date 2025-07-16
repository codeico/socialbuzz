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
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('payout_requests')
      .select(
        `
        *,
        user:users!payout_requests_user_id_fkey (
          username,
          full_name,
          email
        ),
        processor:users!payout_requests_processed_by_fkey (
          username,
          full_name
        )
      `
      )
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      // Note: Advanced filtering with joins might need to be handled differently
      // For now, we'll get all data and filter after
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: payouts, error } = await query;

    if (error) {
      throw error;
    }

    // Generate CSV
    const headers = [
      'ID',
      'User',
      'Email',
      'Amount',
      'Currency',
      'Status',
      'Bank Name',
      'Account Number',
      'Account Holder',
      'Notes',
      'Processed By',
      'Created At',
      'Processed At',
      'Completed At'
    ];

    const csvRows = [headers.join(',')];

    for (const payout of payouts || []) {
      const bankDetails = payout.bank_details || {};
      const row = [
        payout.id,
        payout.user?.full_name || 'Unknown',
        payout.user?.email || 'Unknown',
        payout.amount,
        payout.currency,
        payout.status,
        bankDetails.bank_name || '',
        bankDetails.account_number || '',
        bankDetails.account_holder_name || '',
        (payout.admin_notes || '').replace(/,/g, ';'),
        payout.processor?.full_name || '',
        new Date(payout.created_at).toISOString(),
        payout.processed_at ? new Date(payout.processed_at).toISOString() : '',
        payout.completed_at ? new Date(payout.completed_at).toISOString() : ''
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="payouts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export payouts' }, { status: 500 });
  }
}
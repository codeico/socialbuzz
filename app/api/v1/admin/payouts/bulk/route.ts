import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(request: NextRequest) {
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

    const { payoutIds, action, notes } = await request.json();

    if (!payoutIds || !Array.isArray(payoutIds) || payoutIds.length === 0) {
      return NextResponse.json({ error: 'Invalid payout IDs' }, { status: 400 });
    }

    if (!['approve', 'reject', 'complete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Check all payouts are pending
    const { data: payouts, error: fetchError } = await supabaseAdmin
      .from('payout_requests')
      .select('id, status')
      .in('id', payoutIds);

    if (fetchError) {
      throw fetchError;
    }

    const nonPendingPayouts = payouts?.filter(p => p.status !== 'pending') || [];
    if (nonPendingPayouts.length > 0) {
      return NextResponse.json({ 
        error: `${nonPendingPayouts.length} payout(s) are not in pending status` 
      }, { status: 400 });
    }

    let updateData: any = {
      processed_by: decoded.userId,
      processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.admin_notes = notes;
    }

    if (action === 'approve') {
      updateData.status = 'approved';
    } else if (action === 'reject') {
      updateData.status = 'rejected';
    } else if (action === 'complete') {
      updateData.status = 'completed';
      updateData.completed_at = new Date().toISOString();
    }

    // Update payouts
    const { data, error } = await supabaseAdmin
      .from('payout_requests')
      .update(updateData)
      .in('id', payoutIds)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: `${payoutIds.length} payout(s) ${action}d successfully`,
    });
  } catch (error) {
    console.error('Bulk payout update error:', error);
    return NextResponse.json({ error: 'Failed to update payouts' }, { status: 500 });
  }
}
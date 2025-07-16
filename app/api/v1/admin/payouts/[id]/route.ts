import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { action, notes } = await request.json();
    const resolvedParams = await params;
    const payoutId = resolvedParams.id;

    // Get current payout
    const { data: currentPayout, error: fetchError } = await supabaseAdmin
      .from('payout_requests')
      .select('*')
      .eq('id', payoutId)
      .single();

    if (fetchError || !currentPayout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    }

    if (currentPayout.status !== 'pending') {
      return NextResponse.json({ error: 'Can only update pending payouts' }, { status: 400 });
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
      if (!notes) {
        return NextResponse.json({ error: 'Notes required for rejection' }, { status: 400 });
      }
    } else if (action === 'complete') {
      updateData.status = 'completed';
      updateData.completed_at = new Date().toISOString();
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update payout
    const { data, error } = await supabaseAdmin
      .from('payout_requests')
      .update(updateData)
      .eq('id', payoutId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Payout ${action}d successfully`,
    });
  } catch (error) {
    console.error('Payout update error:', error);
    return NextResponse.json({ error: 'Failed to update payout' }, { status: 500 });
  }
}
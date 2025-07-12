import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;
    const body = await request.json();
    const { action } = body;

    // Get current transaction
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (transactionError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case 'approve':
        if (transaction.status !== 'pending') {
          return NextResponse.json(
            { error: 'Only pending transactions can be approved' },
            { status: 400 }
          );
        }
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
        break;

      case 'cancel':
        if (!['pending', 'failed'].includes(transaction.status)) {
          return NextResponse.json(
            { error: 'Only pending or failed transactions can be cancelled' },
            { status: 400 }
          );
        }
        updateData.status = 'cancelled';
        break;

      case 'retry':
        if (transaction.status !== 'failed') {
          return NextResponse.json(
            { error: 'Only failed transactions can be retried' },
            { status: 400 }
          );
        }
        updateData.status = 'pending';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update transaction
    const { data: updatedTransaction, error } = await supabaseAdmin
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If transaction is completed and it's a donation, update user balances
    if (action === 'approve' && transaction.type === 'donation' && transaction.recipient_id) {
      // Add to recipient's balance and earnings
      await supabaseAdmin
        .from('users')
        .update({
          balance: supabaseAdmin.sql`balance + ${transaction.amount}`,
          total_earnings: supabaseAdmin.sql`total_earnings + ${transaction.amount}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.recipient_id);

      // Update donor's total donations
      await supabaseAdmin
        .from('users')
        .update({
          total_donations: supabaseAdmin.sql`total_donations + ${transaction.amount}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.user_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('Admin transaction update error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { validateCallback } from '@/lib/duitku';
import { supabaseAdmin } from '@/lib/supabase';
import { DonationNotification } from '@/lib/websocket';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Payment callback received:', body);

    const { merchantOrderId, amount, resultCode, merchantUserInfo, reference, signature } = body;

    // Validate callback signature
    if (!validateCallback(body)) {
      console.error('Invalid callback signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Get transaction from database
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .select(
        `
        *,
        donor:users!transactions_user_id_fkey(id, username, full_name),
        recipient:users!transactions_recipient_id_fkey(id, username, full_name)
      `,
      )
      .eq('merchant_order_id', merchantOrderId)
      .single();

    if (transactionError || !transaction) {
      console.error('Transaction not found:', transactionError);
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Determine transaction status based on result code
    let status = 'failed';
    if (resultCode === '00') {
      status = 'completed';
    } else if (resultCode === '01') {
      status = 'pending';
    }

    // Update transaction status
    const { error: updateError } = await supabaseAdmin
      .from('transactions')
      .update({
        status,
        payment_reference: reference,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
    }

    // If payment is successful, send donation notification
    if (status === 'completed' && transaction.type === 'donation') {
      try {
        // Create donation notification
        const donationNotification: DonationNotification = {
          id: transaction.id,
          donorName: transaction.donor?.full_name || 'Anonymous',
          amount: transaction.amount,
          message: transaction.message || '',
          timestamp: new Date().toISOString(),
          creatorId: transaction.recipient_id,
          creatorUsername: transaction.recipient?.username || '',
          isAnonymous: transaction.is_anonymous || false,
          currency: 'IDR',
        };

        // Send WebSocket notification
        if (global.wsServer) {
          global.wsServer.emit('donation-notification', donationNotification);
          console.log('Donation notification sent:', donationNotification);
        }

        // Update user balances
        await Promise.all([
          // Add to recipient balance
          supabaseAdmin.rpc('update_user_balance', {
            user_id: transaction.recipient_id,
            amount_change: transaction.amount - (transaction.fee || 0),
          }),
          // Update recipient total earnings
          supabaseAdmin.rpc('update_user_earnings', {
            user_id: transaction.recipient_id,
            amount_change: transaction.amount,
          }),
          // Update donor total donations
          supabaseAdmin.rpc('update_user_donations', {
            user_id: transaction.user_id,
            amount_change: transaction.amount,
          }),
        ]);

        // Create notification record
        await supabaseAdmin.from('notifications').insert({
          user_id: transaction.recipient_id,
          type: 'donation_received',
          title: 'New Donation Received!',
          message: `You received ${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(transaction.amount)} from ${transaction.is_anonymous ? 'Anonymous' : transaction.donor?.full_name}`,
          data: {
            donationId: transaction.id,
            amount: transaction.amount,
            donorName: transaction.is_anonymous ? 'Anonymous' : transaction.donor?.full_name,
          },
          created_at: new Date().toISOString(),
        });
      } catch (notificationError) {
        console.error('Error sending donation notification:', notificationError);
        // Don't fail the callback if notification fails
      }
    }

    console.log(`Transaction ${merchantOrderId} updated to ${status}`);

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
      data: {
        merchantOrderId,
        status,
        amount,
      },
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

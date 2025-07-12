import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateCallback, isPaymentSuccessful } from '@/lib/duitku';
import { PaymentCallback } from '@/types/payment';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentCallback = await req.json();

    console.log('Payment callback received:', body);

    // Validate callback signature and data
    if (!validateCallback(body)) {
      console.error('Invalid payment callback:', body);
      return NextResponse.json({ success: false, error: 'Invalid callback signature' }, { status: 400 });
    }

    // Find the transaction by merchant order ID
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('merchant_order_id', body.merchantOrderId)
      .single();

    if (transactionError || !transaction) {
      console.error('Transaction not found:', body.merchantOrderId);
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }

    // Check if transaction is already processed
    if (transaction.status !== 'pending') {
      console.log('Transaction already processed:', transaction.id);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Update transaction status
    const isSuccess = isPaymentSuccessful(body);
    const newStatus = isSuccess ? 'completed' : 'failed';

    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: newStatus,
        reference: body.reference,
        completed_at: new Date().toISOString(),
        metadata: {
          ...transaction.metadata,
          callback: body,
        },
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update transaction' }, { status: 500 });
    }

    // If payment is successful, process the donation
    if (isSuccess && transaction.type === 'donation') {
      await processSuccessfulDonation(transaction);
    }

    console.log(`Transaction ${transaction.id} ${newStatus}`);

    return NextResponse.json({
      success: true,
      message: `Transaction ${newStatus}`,
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

async function processSuccessfulDonation(transaction: any) {
  try {
    // Update recipient's balance and total earnings
    await supabase.rpc('increment_user_balance', {
      user_id: transaction.recipient_id,
      amount: transaction.amount,
    });

    // Update donor's total donations
    await supabase.rpc('increment_user_donations', {
      user_id: transaction.user_id,
      amount: transaction.amount,
    });

    // Create donation record
    await supabase.from('donations').insert({
      donor_id: transaction.user_id,
      recipient_id: transaction.recipient_id,
      amount: transaction.amount,
      currency: transaction.currency,
      message: transaction.metadata?.message || null,
      is_anonymous: transaction.metadata?.isAnonymous || false,
      transaction_id: transaction.id,
    });

    console.log(`Donation processed for transaction ${transaction.id}`);
  } catch (error) {
    console.error('Error processing donation:', error);
  }
}

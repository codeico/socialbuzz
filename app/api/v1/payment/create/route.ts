import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createPaymentRequest, generateMerchantOrderId } from '@/lib/duitku';
import { withAuth } from '@/lib/middleware';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const {
      recipientId,
      amount,
      paymentMethod,
      message,
      isAnonymous = false,
    } = body;

    if (!recipientId || !amount || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (amount < 1000) {
      return NextResponse.json(
        { success: false, error: 'Minimum donation amount is Rp 1,000' },
        { status: 400 },
      );
    }

    // Get recipient info
    const { data: recipient, error: recipientError } = await supabase
      .from('users')
      .select('id, full_name, email')
      .eq('id', recipientId)
      .single();

    if (recipientError || !recipient) {
      return NextResponse.json(
        { success: false, error: 'Recipient not found' },
        { status: 404 },
      );
    }

    // Generate merchant order ID
    const merchantOrderId = generateMerchantOrderId(req.user.id);

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: req.user.id,
        recipient_id: recipientId,
        type: 'donation',
        amount: amount,
        currency: 'IDR',
        status: 'pending',
        payment_method: paymentMethod,
        merchant_order_id: merchantOrderId,
        description: `Donation to ${recipient.full_name}`,
        metadata: {
          message,
          isAnonymous,
        },
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      return NextResponse.json(
        { success: false, error: 'Failed to create transaction' },
        { status: 500 },
      );
    }

    // Create Duitku payment request
    const paymentRequest = {
      paymentAmount: amount,
      paymentMethod: paymentMethod,
      merchantOrderId: merchantOrderId,
      productDetails: `Donation to ${recipient.full_name}`,
      customerEmail: req.user.email,
      customerName: req.user.fullName,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/payment/callback`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    };

    const paymentResponse = await createPaymentRequest(paymentRequest);

    if (paymentResponse.statusCode !== '00') {
      // Update transaction status to failed
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      return NextResponse.json(
        { success: false, error: 'Failed to create payment' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction.id,
        paymentUrl: paymentResponse.paymentUrl,
        reference: paymentResponse.reference,
        vaNumber: paymentResponse.vaNumber,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
});

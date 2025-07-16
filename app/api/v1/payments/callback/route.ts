import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyCallbackSignature } from '@/lib/duitku';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchantCode,
      amount,
      merchantOrderId,
      productDetail,
      additionalParam,
      paymentCode,
      resultCode,
      merchantUserId,
      reference,
      signature
    } = body;

    console.log('Duitku callback received:', {
      merchantOrderId,
      resultCode,
      amount,
      reference,
      signature
    });

    // Verify signature
    const apiKey = process.env.DUITKU_API_KEY;
    if (!apiKey) {
      console.error('Duitku API key not configured');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const isValidSignature = verifyCallbackSignature(
      merchantCode,
      amount,
      merchantOrderId,
      apiKey,
      signature
    );

    if (!isValidSignature) {
      console.error('Invalid signature in callback');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Find donation by transaction ID
    const { data: donation, error: donationError } = await supabaseAdmin
      .from('donations')
      .select('*')
      .eq('duitku_transaction_id', merchantOrderId)
      .single();

    if (donationError || !donation) {
      console.error('Donation not found for transaction:', merchantOrderId);
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Determine payment status based on result code
    let paymentStatus = 'failed';
    let paidAt = null;

    if (resultCode === '00') {
      paymentStatus = 'paid';
      paidAt = new Date().toISOString();
    } else if (resultCode === '01') {
      paymentStatus = 'processing';
    } else {
      paymentStatus = 'failed';
    }

    // Update donation status
    const updateData = {
      payment_status: paymentStatus,
      paid_at: paidAt,
      payment_details: {
        ...(donation.payment_details || {}),
        callbackData: {
          merchantOrderId,
          resultCode,
          amount,
          reference,
          paymentCode,
          additionalParam,
          receivedAt: new Date().toISOString()
        }
      },
      updated_at: new Date().toISOString()
    };

    const { data: updatedDonation, error: updateError } = await supabaseAdmin
      .from('donations')
      .update(updateData)
      .eq('id', donation.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating donation status:', updateError);
      return NextResponse.json({ error: 'Failed to update donation' }, { status: 500 });
    }

    // If payment successful, send notification
    if (paymentStatus === 'paid') {
      try {
        const notificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/notifications/donation`;
        const notificationPayload = {
          transactionId: donation.id,
          creatorId: donation.recipient_id,
          amount: donation.amount,
          donorName: donation.donor_name,
          message: donation.message,
          isAnonymous: donation.is_anonymous
        };
        
        console.log('Sending notification to OBS:', {
          url: notificationUrl,
          payload: notificationPayload
        });
        
        const notificationResponse = await fetch(notificationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationPayload),
        });
        
        const notificationResult = await notificationResponse.json();
        console.log('Notification response:', notificationResult);
        
        if (!notificationResponse.ok) {
          console.error('Notification failed:', notificationResult);
        } else {
          console.log('Notification sent successfully to OBS');
        }
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }
    }

    console.log('Donation updated successfully:', {
      donationId: donation.id,
      status: paymentStatus,
      amount: donation.amount
    });

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully'
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json({
      success: false,
      error: 'Callback processing failed'
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createPaymentRequest, generateMerchantOrderId } from '@/lib/duitku';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      donationId,
      recipientId, 
      amount, 
      message, 
      donorName,
      donorEmail,
      isAnonymous = false,
      paymentMethod = 'VC',
      type = 'donation'
    } = body;

    // Validation
    if (!donationId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Donation ID is required' 
      }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment method is required' 
      }, { status: 400 });
    }

    // Get donation details
    const { data: donation, error: donationError } = await supabaseAdmin
      .from('donations')
      .select(`
        *,
        recipient:users!recipient_id (
          id,
          username,
          full_name,
          email
        )
      `)
      .eq('id', donationId)
      .single();

    if (donationError || !donation) {
      return NextResponse.json({ 
        success: false, 
        error: 'Donation not found' 
      }, { status: 404 });
    }

    // Check if donation is still valid
    if (!['pending', 'processing'].includes(donation.payment_status)) {
      return NextResponse.json({ 
        success: false, 
        error: `Donation status is ${donation.payment_status}. Cannot create payment for completed or expired donations.` 
      }, { status: 400 });
    }

    // Check if donation has expired
    const now = new Date();
    const expiryTime = new Date(donation.expires_at);
    
    if (now > expiryTime) {
      // Update status to expired
      await supabaseAdmin
        .from('donations')
        .update({ 
          payment_status: 'expired',
          updated_at: now.toISOString()
        })
        .eq('id', donationId);
      
      return NextResponse.json({ 
        success: false, 
        error: 'Donation has expired' 
      }, { status: 400 });
    }

    // Generate merchant order ID
    const merchantOrderId = await generateMerchantOrderId(donation.recipient_id);

    // Get full email for Duitku (either from payment_details or donor_email if not censored)
    const fullEmail = donation.payment_details?.full_email || donation.donor_email;
    
    // Create Duitku payment request
    const paymentRequest = {
      paymentAmount: donation.amount,
      paymentMethod: paymentMethod,
      merchantOrderId: merchantOrderId,
      productDetails: `Donation to ${donation.recipient.full_name}`,
      customerName: donation.donor_name,
      customerEmail: fullEmail, // Use full email for Duitku
      customerPhone: '',
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/payments/callback`,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      expiryPeriod: 60, // 1 hour
    };

    // Create payment with Duitku
    console.log('Creating payment with Duitku:', paymentRequest);
    const paymentResponse = await createPaymentRequest(paymentRequest);
    console.log('Duitku payment response:', paymentResponse);

    // Validate Duitku response
    if (!paymentResponse || paymentResponse.statusCode !== '00') {
      console.error('Invalid Duitku response:', paymentResponse);
      return NextResponse.json({
        success: false,
        error: 'Payment gateway error',
        details: process.env.NODE_ENV === 'development' ? 
          `Duitku error: ${paymentResponse?.statusMessage || 'Unknown error'}` : 
          'Payment service temporarily unavailable'
      }, { status: 500 });
    }

    // Update donation with payment details (preserve full email)
    const updateData = {
      payment_method: paymentMethod,
      payment_status: 'processing',
      duitku_transaction_id: merchantOrderId,
      duitku_reference: paymentResponse.reference || null,
      duitku_payment_url: paymentResponse.paymentUrl || null,
      duitku_va_number: paymentResponse.vaNumber || null,
      duitku_qr_code: paymentResponse.qrCode || null,
      payment_details: {
        ...donation.payment_details, // Preserve existing payment_details including full_email
        merchantOrderId,
        paymentMethod,
        duitkuResponse: paymentResponse,
        createdAt: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    };

    const { data: updatedDonation, error: updateError } = await supabaseAdmin
      .from('donations')
      .update(updateData)
      .eq('id', donationId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating donation with payment details:', updateError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save payment details' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        donationId: donation.id,
        transactionId: merchantOrderId,
        reference: paymentResponse.reference,
        paymentUrl: paymentResponse.paymentUrl,
        vaNumber: paymentResponse.vaNumber,
        qrCode: paymentResponse.qrCode || paymentResponse.qrString || paymentResponse.qrUrl,
        qrString: paymentResponse.qrString,
        amount: donation.amount,
        paymentMethod: paymentMethod,
        expiryTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        recipient: {
          id: donation.recipient.id,
          username: donation.recipient.username,
          full_name: donation.recipient.full_name
        },
        donor: {
          name: donation.donor_name,
          email: donation.donor_email, // This will be censored if hide_email was true
          is_anonymous: donation.is_anonymous
        },
        // Include full Duitku response for debugging
        ...(process.env.NODE_ENV === 'development' && {
          duitkuResponse: paymentResponse
        })
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    // Enhanced error logging for better debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return more detailed error information
    return NextResponse.json({
      success: false,
      error: 'Payment creation failed',
      details: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : 
        'Failed to create payment request',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : undefined
      })
    }, { status: 500 });
  }
}
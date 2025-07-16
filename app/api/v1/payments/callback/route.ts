import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyCallbackSignature } from '@/lib/duitku';

export async function POST(request: NextRequest) {
  try {
    // Log request details for debugging
    console.log('Callback request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Callback request method:', request.method);
    
    let body;
    const contentType = request.headers.get('content-type') || '';
    
    // Handle different content types from Duitku
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    } else {
      // Try to parse as text first, then JSON
      const text = await request.text();
      console.log('Raw callback data:', text);
      
      try {
        body = JSON.parse(text);
      } catch (parseError) {
        console.log('Failed to parse as JSON, trying form data...');
        // If JSON parse fails, try to parse as URL encoded
        const params = new URLSearchParams(text);
        body = Object.fromEntries(params);
      }
    }
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

    // Get Duitku settings from database
    const { data: settings } = await supabaseAdmin
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'duitku_settings')
      .single();

    const duitkuSettings = settings?.setting_value || {};
    const apiKey = duitkuSettings.api_key || process.env.DUITKU_API_KEY;
    const configuredMerchantCode = duitkuSettings.merchant_code || process.env.DUITKU_MERCHANT_CODE;

    if (!apiKey || !configuredMerchantCode) {
      console.error('Duitku configuration not found:', { 
        hasApiKey: !!apiKey, 
        hasMerchantCode: !!configuredMerchantCode 
      });
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    console.log('Using merchant config:', {
      receivedMerchantCode: merchantCode,
      configuredMerchantCode,
      matches: merchantCode === configuredMerchantCode
    });

    const isValidSignature = verifyCallbackSignature(
      configuredMerchantCode, // Use configured merchant code, not from callback
      parseInt(amount),
      merchantOrderId,
      apiKey,
      signature
    );

    if (!isValidSignature) {
      console.error('Invalid signature in callback');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Find donation by transaction ID - try multiple methods
    console.log('Looking for donation with merchantOrderId:', merchantOrderId);
    
    let donation = null;
    let donationError = null;
    
    // Try finding by duitku_transaction_id first
    const { data: donationByDuitku, error: duitkuError } = await supabaseAdmin
      .from('donations')
      .select('*')
      .eq('duitku_transaction_id', merchantOrderId)
      .single();

    if (!duitkuError && donationByDuitku) {
      donation = donationByDuitku;
      console.log('Found donation by duitku_transaction_id');
    } else {
      // Try finding by donation ID (in case merchantOrderId is donation ID)
      const { data: donationById, error: idError } = await supabaseAdmin
        .from('donations')
        .select('*')
        .eq('id', merchantOrderId)
        .single();

      if (!idError && donationById) {
        donation = donationById;
        console.log('Found donation by donation ID');
      } else {
        // Log both errors for debugging
        console.error('Donation not found by duitku_transaction_id:', duitkuError);
        console.error('Donation not found by ID:', idError);
        console.error('merchantOrderId searched:', merchantOrderId);
        
        // List recent donations for debugging
        const { data: recentDonations } = await supabaseAdmin
          .from('donations')
          .select('id, duitku_transaction_id, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        
        console.log('Recent 5 donations:', recentDonations);
        
        return NextResponse.json({ 
          error: 'Donation not found',
          details: {
            merchantOrderId,
            searchedBy: ['duitku_transaction_id', 'id'],
            recentDonations: recentDonations?.map(d => ({
              id: d.id,
              duitku_transaction_id: d.duitku_transaction_id
            }))
          }
        }, { status: 404 });
      }
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
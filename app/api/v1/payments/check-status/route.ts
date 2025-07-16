import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { donationId, transactionId, reference } = await request.json();

    if (!donationId && !transactionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Donation ID or Transaction ID is required' 
      }, { status: 400 });
    }

    // First, get donation details from database
    let donation = null;
    let actualTransactionId = transactionId;

    if (donationId) {
      const { data: donationData, error: donationError } = await supabaseAdmin
        .from('donations')
        .select('*')
        .eq('id', donationId)
        .single();

      if (donationError || !donationData) {
        return NextResponse.json({ 
          success: false, 
          error: 'Donation not found' 
        }, { status: 404 });
      }

      donation = donationData;
      actualTransactionId = donation.duitku_transaction_id;
    } else if (transactionId) {
      const { data: donationData, error: donationError } = await supabaseAdmin
        .from('donations')
        .select('*')
        .eq('duitku_transaction_id', transactionId)
        .single();

      if (donationError || !donationData) {
        return NextResponse.json({ 
          success: false, 
          error: 'Donation not found' 
        }, { status: 404 });
      }

      donation = donationData;
    }

    if (!actualTransactionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Transaction ID not found' 
      }, { status: 400 });
    }

    // Get Duitku configuration from system_settings
    const { data: duitkuSettings, error: settingsError } = await supabaseAdmin
      .from('system_settings')
      .select('key, value')
      .in('key', ['duitku_api_key', 'duitku_merchant_code', 'duitku_sandbox_mode'])
      .eq('category', 'payment');

    if (settingsError) {
      console.error('Error fetching Duitku settings:', settingsError);
      return NextResponse.json({ 
        success: false, 
        error: 'Payment gateway configuration error' 
      }, { status: 500 });
    }

    const settingsMap = Object.fromEntries(
      duitkuSettings?.map(setting => [setting.key, setting.value]) || []
    );

    const merchantCode = settingsMap.duitku_merchant_code || process.env.DUITKU_MERCHANT_CODE;
    const apiKey = settingsMap.duitku_api_key || process.env.DUITKU_API_KEY;
    const sandboxMode = settingsMap.duitku_sandbox_mode === 'true' || settingsMap.duitku_sandbox_mode === true;
    const baseUrl = sandboxMode 
      ? 'https://sandbox.duitku.com/webapi/api'
      : 'https://passport.duitku.com/webapi/api';

    console.log('Check-status using config:', {
      merchantCode,
      hasApiKey: !!apiKey,
      sandboxMode,
      baseUrl,
      donationId,
      actualTransactionId
    });

    if (!merchantCode || !apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment gateway not configured' 
      }, { status: 500 });
    }

    // Check if donation is already paid in our database first
    if (donation && donation.payment_status === 'paid') {
      console.log('Donation already marked as paid in database:', donationId);
      return NextResponse.json({
        success: true,
        data: {
          donationId: donation.id,
          transactionId: actualTransactionId,
          reference: donation.duitku_reference,
          status: 'paid',
          statusCode: '00',
          statusMessage: 'Transaction successful (from database)',
          amount: donation.amount,
          source: 'database'
        }
      });
    }

    // Create signature for status check
    const signature = crypto
      .createHash('md5')
      .update(`${merchantCode}${actualTransactionId}${apiKey}`)
      .digest('hex');

    // Call Duitku status check API (v2)
    const statusResponse = await fetch(`${baseUrl}/merchant/transactionStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchantCode: merchantCode,
        merchantOrderId: actualTransactionId,
        signature: signature,
      }),
    });

    const statusData = await statusResponse.json();

    console.log('Duitku status check response:', {
      status: statusResponse.status,
      statusText: statusResponse.statusText,
      data: statusData,
      donationId,
      actualTransactionId
    });

    // Handle Duitku response
    if (statusResponse.ok) {
      // Map Duitku status to our internal status
      let mappedStatus = 'pending';
      
      if (statusData.statusCode === '00') {
        mappedStatus = 'paid';
      } else if (statusData.statusCode === '01') {
        mappedStatus = 'pending';
      } else if (statusData.statusCode === '02') {
        mappedStatus = 'expired';
      } else {
        mappedStatus = 'failed';
      }

      // Update donation status in database if it has changed
      if (donation && donation.payment_status !== mappedStatus) {
        const updateData = {
          payment_status: mappedStatus,
          paid_at: mappedStatus === 'paid' ? new Date().toISOString() : null,
          payment_details: {
            ...(donation.payment_details || {}),
            statusCheckData: {
              statusCode: statusData.statusCode,
              statusMessage: statusData.statusMessage,
              amount: statusData.amount,
              checkedAt: new Date().toISOString()
            }
          },
          updated_at: new Date().toISOString()
        };

        await supabaseAdmin
          .from('donations')
          .update(updateData)
          .eq('id', donation.id);
      }

      return NextResponse.json({
        success: true,
        data: {
          donationId: donation?.id,
          transactionId: actualTransactionId,
          reference: reference || donation?.duitku_reference,
          status: mappedStatus,
          statusCode: statusData.statusCode,
          statusMessage: statusData.statusMessage,
          amount: statusData.amount,
          rawResponse: statusData
        }
      });
    } else {
      // Log the actual Duitku response for debugging
      console.log('Duitku API response error:', {
        status: statusResponse.status,
        statusText: statusResponse.statusText,
        data: statusData
      });

      return NextResponse.json({
        success: false,
        error: 'Payment not found or failed',
        details: {
          message: statusData.Message || statusData.message || 'Transaction not found',
          statusCode: statusData.statusCode,
          duitkuResponse: statusData
        }
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check payment status'
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Donation ID is required' 
      }, { status: 400 });
    }

    // Get donation details with recipient info
    const { data: donation, error } = await supabaseAdmin
      .from('donations')
      .select(`
        *,
        recipient:users!recipient_id (
          id,
          username,
          full_name,
          avatar
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching donation:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Donation not found' 
      }, { status: 404 });
    }

    if (!donation) {
      return NextResponse.json({ 
        success: false, 
        error: 'Donation not found' 
      }, { status: 404 });
    }

    // Check if donation has expired
    const now = new Date();
    const expiryTime = new Date(donation.expires_at);
    
    if (now > expiryTime && donation.payment_status === 'pending') {
      // Update status to expired
      await supabaseAdmin
        .from('donations')
        .update({ 
          payment_status: 'expired',
          updated_at: now.toISOString()
        })
        .eq('id', id);
      
      donation.payment_status = 'expired';
    }

    return NextResponse.json({
      success: true,
      data: {
        id: donation.id,
        recipient_id: donation.recipient_id,
        amount: donation.amount,
        message: donation.message,
        donor_name: donation.donor_name,
        donor_email: donation.donor_email,
        is_anonymous: donation.is_anonymous,
        payment_method: donation.payment_method,
        payment_status: donation.payment_status,
        duitku_transaction_id: donation.duitku_transaction_id,
        duitku_reference: donation.duitku_reference,
        duitku_payment_url: donation.duitku_payment_url,
        duitku_va_number: donation.duitku_va_number,
        duitku_qr_code: donation.duitku_qr_code,
        payment_details: donation.payment_details,
        created_at: donation.created_at,
        updated_at: donation.updated_at,
        paid_at: donation.paid_at,
        expires_at: donation.expires_at,
        recipient: {
          id: donation.recipient.id,
          username: donation.recipient.username,
          full_name: donation.recipient.full_name,
          avatar: donation.recipient.avatar
        }
      }
    });

  } catch (error) {
    console.error('Get donation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Donation ID is required' 
      }, { status: 400 });
    }

    const allowedFields = [
      'payment_method',
      'payment_status',
      'duitku_transaction_id',
      'duitku_reference',
      'duitku_payment_url',
      'duitku_va_number',
      'duitku_qr_code',
      'payment_details',
      'paid_at'
    ];

    const updateData: any = {};
    
    // Only allow updating specific fields
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // If payment_status is being set to 'paid', also set paid_at
    if (body.payment_status === 'paid' && !body.paid_at) {
      updateData.paid_at = new Date().toISOString();
    }

    const { data: donation, error } = await supabaseAdmin
      .from('donations')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating donation:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update donation' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: donation
    });

  } catch (error) {
    console.error('Update donation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { handleCors } from '@/lib/middleware';
import { censorEmail } from '@/lib/email-utils';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipient_id, 
      amount, 
      message, 
      donor_name, 
      donor_email,
      is_anonymous = false,
      hide_email = false,
      agree_to_terms = false,
      confirm_age = false
    } = body;

    // Validation
    if (!recipient_id || !amount || !donor_name || !donor_email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: recipient_id, amount, donor_name, donor_email' 
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donor_email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please enter a valid email address' 
      }, { status: 400 });
    }

    // Terms and age validation
    if (!agree_to_terms) {
      return NextResponse.json({ 
        success: false, 
        error: 'You must agree to the terms and conditions' 
      }, { status: 400 });
    }

    if (!confirm_age) {
      return NextResponse.json({ 
        success: false, 
        error: 'You must confirm that you are 18 years of age or older' 
      }, { status: 400 });
    }

    if (amount < 5000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Minimum donation amount is Rp 5,000' 
      }, { status: 400 });
    }

    if (amount > 50000000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Maximum donation amount is Rp 50,000,000' 
      }, { status: 400 });
    }

    // Verify recipient exists
    const { data: recipient, error: recipientError } = await supabaseAdmin
      .from('users')
      .select('id, username, full_name, email')
      .eq('id', recipient_id)
      .single();

    if (recipientError || !recipient) {
      return NextResponse.json({ 
        success: false, 
        error: 'Recipient not found' 
      }, { status: 404 });
    }

    // Determine what email to store in database
    const emailToStore = hide_email ? censorEmail(donor_email.trim()) : donor_email.trim();
    
    // Create donation record
    const { data: donation, error: donationError } = await supabaseAdmin
      .from('donations')
      .insert({
        recipient_id,
        amount: parseInt(amount),
        message: message?.trim() || null,
        donor_name: donor_name.trim(),
        donor_email: emailToStore, // Store censored email if hide_email is true
        is_anonymous,
        payment_status: 'pending',
        expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour expiry
        // Store full email in payment_details for Duitku usage
        payment_details: {
          full_email: donor_email.trim(), // Always store full email for Duitku
          hide_email: hide_email,
          agree_to_terms: agree_to_terms,
          confirm_age: confirm_age,
          agreed_at: new Date().toISOString()
        }
      })
      .select('*')
      .single();

    if (donationError) {
      console.error('Error creating donation:', donationError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create donation' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: donation.id,
        recipient_id: donation.recipient_id,
        amount: donation.amount,
        message: donation.message,
        donor_name: donation.donor_name,
        is_anonymous: donation.is_anonymous,
        payment_status: donation.payment_status,
        expires_at: donation.expires_at,
        created_at: donation.created_at,
        recipient: {
          username: recipient.username,
          full_name: recipient.full_name
        }
      }
    });

  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
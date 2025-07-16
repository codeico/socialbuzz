import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 20);

    // Get recent donations for the user
    const { data: donations, error } = await supabaseAdmin
      .from('donations')
      .select(`
        id,
        amount,
        message,
        donor_name,
        donor_email,
        is_anonymous,
        created_at,
        payment_status
      `)
      .eq('recipient_id', userId)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent donations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recent donations' },
        { status: 500 }
      );
    }

    // Format donations for frontend
    const formattedDonations = donations?.map(donation => ({
      id: donation.id,
      amount: donation.amount,
      message: donation.message || '',
      donorName: donation.is_anonymous ? 'Someone' : donation.donor_name,
      donorEmail: donation.donor_email,
      isAnonymous: donation.is_anonymous,
      createdAt: donation.created_at,
    })) || [];

    return NextResponse.json({
      success: true,
      data: formattedDonations,
    });
  } catch (error) {
    console.error('Recent donations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
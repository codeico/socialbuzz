import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get donation transactions for this user with donor information
    const {
      data: donations,
      error,
      count,
    } = await supabaseAdmin
      .from('transactions')
      .select(
        `
        id,
        amount,
        message,
        created_at,
        metadata,
        status
      `,
        { count: 'exact' },
      )
      .eq('recipient_id', id)
      .eq('type', 'donation')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Debug: Log the status of donations
    console.log('Donations found:', donations?.length);
    console.log('Donation statuses:', donations?.map(d => d.status));

    // Transform transactions data
    const transformedDonations =
      donations?.map((transaction: any) => {
        const isAnonymous = transaction.metadata?.isAnonymous || transaction.metadata?.is_anonymous || false;
        const donorName = transaction.metadata?.donorName || 'Anonymous';
        const donorEmail = transaction.metadata?.donorEmail || null;
        
        return {
          id: transaction.id,
          amount: transaction.amount,
          message: transaction.message || '',
          isAnonymous: isAnonymous,
          supporterName: donorName,
          supporterEmail: isAnonymous ? null : donorEmail,
          createdAt: transaction.created_at,
        };
      }) || [];

    return NextResponse.json({
      success: true,
      data: transformedDonations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('User donations fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user donations' }, { status: 500 });
  }
}

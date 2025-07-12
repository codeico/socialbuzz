import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from('payout_requests')
      .select('*', { count: 'exact' })
      .eq('user_id', decoded.userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching payout requests:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch payout requests' },
        { status: 500 }
      );
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        data: data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get payout requests error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, bankAccount } = body;

    if (!amount || !bankAccount) {
      return NextResponse.json(
        { success: false, error: 'Amount and bank account are required' },
        { status: 400 }
      );
    }

    if (amount < 50000) {
      return NextResponse.json(
        { success: false, error: 'Minimum payout amount is Rp 50,000' },
        { status: 400 }
      );
    }

    // Check user balance
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('balance')
      .eq('id', decoded.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.balance < amount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create payout request
    const { data: payoutRequest, error: payoutError } = await supabaseAdmin
      .from('payout_requests')
      .insert({
        user_id: decoded.userId,
        amount: amount,
        currency: 'IDR',
        bank_account: bankAccount,
        status: 'pending',
      })
      .select()
      .single();

    if (payoutError) {
      console.error('Error creating payout request:', payoutError);
      return NextResponse.json(
        { success: false, error: 'Failed to create payout request' },
        { status: 500 }
      );
    }

    // Update user balance
    const { error: balanceError } = await supabaseAdmin
      .from('users')
      .update({ 
        balance: user.balance - amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', decoded.userId);

    if (balanceError) {
      console.error('Error updating user balance:', balanceError);
      // Rollback payout request if balance update fails
      await supabaseAdmin
        .from('payout_requests')
        .delete()
        .eq('id', payoutRequest.id);
      
      return NextResponse.json(
        { success: false, error: 'Failed to update balance' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payoutRequest,
    });
  } catch (error) {
    console.error('Create payout request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
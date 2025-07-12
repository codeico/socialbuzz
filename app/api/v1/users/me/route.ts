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

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select(
        `
        id,
        email,
        username,
        full_name,
        avatar,
        role,
        is_verified,
        balance,
        total_earnings,
        total_donations,
        created_at,
        updated_at
      `,
      )
      .eq('id', decoded.userId)
      .single();

    if (error) {
      console.error('User fetch error:', error);
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { fullName, avatar } = body;

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({
        full_name: fullName,
        avatar: avatar || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', decoded.userId)
      .select()
      .single();

    if (error) {
      console.error('Update user error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Soft delete the user account
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', decoded.userId);

    if (error) {
      console.error('Delete user error:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

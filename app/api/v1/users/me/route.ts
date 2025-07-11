import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withAuth } from '@/lib/middleware';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export const GET = withAuth(async (req) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
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
      `)
      .eq('id', req.user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
});

export const PUT = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { fullName, avatar } = body;

    if (!fullName) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 },
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        avatar: avatar || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Update user error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
});

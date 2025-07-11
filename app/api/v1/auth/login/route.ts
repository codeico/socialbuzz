import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { verifyPassword, generateToken } from '@/lib/auth';
import { LoginCredentials } from '@/types/user';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginCredentials = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const authUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.is_verified,
    };

    const token = generateToken(authUser);

    // Update last login using admin client
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: authUser,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

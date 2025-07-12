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

    // Check if user is admin
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (userError || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (status && status !== 'all') {
      if (status === 'verified') {
        query = query.eq('is_verified', true);
      } else if (status === 'unverified') {
        query = query.eq('is_verified', false);
      }
    }

    const { data: users, error, count } = await query;

    if (error) {
      throw error;
    }

    // Remove password_hash from response
    const sanitizedUsers =
      users?.map(user => {
        const { password_hash, ...sanitizedUser } = user;
        return sanitizedUser;
      }) || [];

    return NextResponse.json({
      success: true,
      data: sanitizedUsers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
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

    // Check if user is admin
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (userError || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, username, full_name, password_hash, role = 'user' } = body;

    // Validate required fields
    if (!email || !username || !full_name || !password_hash) {
      return NextResponse.json({ error: 'Email, username, full name, and password are required' }, { status: 400 });
    }

    // Create new user
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        username,
        full_name,
        password_hash,
        role,
        is_verified: false,
        balance: 0,
        total_earnings: 0,
        total_donations: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Remove password_hash from response
    const { password_hash: _, ...sanitizedUser } = newUser;

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: sanitizedUser,
    });
  } catch (error) {
    console.error('Admin user creation error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

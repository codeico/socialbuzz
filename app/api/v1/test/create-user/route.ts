import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, fullName, password } = body;

    if (!username || !email || !fullName || !password) {
      return NextResponse.json(
        { error: 'Username, email, full name, and password are required' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        username,
        email,
        full_name: fullName,
        password_hash: passwordHash,
        role: 'user',
        is_verified: false,
        balance: 0,
        total_earnings: 0,
        total_donations: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('User creation error:', error);
      return NextResponse.json(
        { error: `Failed to create user: ${error.message}` },
        { status: 500 }
      );
    }

    // Create basic profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: user.id,
        bio: `Hello, I'm ${fullName}! Welcome to my profile.`,
        social_links: {
          website: '',
          twitter: '',
          instagram: '',
          youtube: '',
        },
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          privacyMode: false,
        },
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the request if profile creation fails
    }

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
        },
        profile: profile || null,
      },
    });
  } catch (error) {
    console.error('Test user creation error:', error);
    return NextResponse.json(
      { error: `Failed to create test user: ${error.message}` },
      { status: 500 }
    );
  }
}
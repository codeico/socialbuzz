import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: testConnection, error: connectionError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('Connection error:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectionError.message,
        code: connectionError.code,
      });
    }

    // Test 2: Check users table structure
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.error('Users table error:', usersError);
      return NextResponse.json({
        success: false,
        error: 'Users table query failed',
        details: usersError.message,
        code: usersError.code,
      });
    }

    // Test 3: Check user_profiles table
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.error('Profiles table error:', profilesError);
      return NextResponse.json({
        success: false,
        error: 'User profiles table query failed',
        details: profilesError.message,
        code: profilesError.code,
      });
    }

    // Test 4: Check donations table
    const { data: donations, error: donationsError } = await supabaseAdmin
      .from('donations')
      .select('*')
      .limit(5);

    if (donationsError) {
      console.error('Donations table error:', donationsError);
      return NextResponse.json({
        success: false,
        error: 'Donations table query failed',
        details: donationsError.message,
        code: donationsError.code,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        usersCount: users?.length || 0,
        profilesCount: profiles?.length || 0,
        donationsCount: donations?.length || 0,
        sampleUser: users?.[0] || null,
        sampleProfile: profiles?.[0] || null,
      },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error.message,
    }, { status: 500 });
  }
}
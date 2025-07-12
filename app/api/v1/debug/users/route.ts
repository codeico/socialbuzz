import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, username, full_name, created_at')
      .limit(5);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
      });
    }

    // Get table schema info
    const { data: columns, error: schemaError } = await supabaseAdmin
      .rpc('get_table_columns', { table_name: 'users' })
      .catch(() => null);

    return NextResponse.json({
      success: true,
      data: {
        users_count: users?.length || 0,
        sample_users: users,
        schema_available: !schemaError,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
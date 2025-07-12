import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test 1: Create a test token
    const testUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user',
    };
    
    const testToken = generateToken(testUser);
    
    // Test 2: Verify the token
    const decoded = verifyToken(testToken);
    
    // Test 3: Database connection
    const { data: users, error: dbError } = await supabaseAdmin
      .from('users')
      .select('id, email, username')
      .limit(1);

    return NextResponse.json({
      success: true,
      tests: {
        token_generation: !!testToken,
        token_verification: !!decoded,
        decoded_structure: decoded,
        database_connection: !dbError,
        sample_user: users?.[0] || null,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
    });
  }
}
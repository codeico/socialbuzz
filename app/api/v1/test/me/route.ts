import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log('Auth header:', authHeader);
    console.log('Token:', token);
    
    if (!token) {
      return NextResponse.json({ 
        error: 'No token',
        debug: { 
          hasAuthHeader: !!authHeader,
          authHeaderValue: authHeader 
        }
      });
    }

    const decoded = verifyToken(token);
    console.log('Decoded:', decoded);
    
    if (!decoded) {
      return NextResponse.json({ 
        error: 'Invalid token',
        debug: { 
          tokenLength: token.length,
          tokenPreview: token.substring(0, 20) + '...'
        }
      });
    }

    // Check if user exists in database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, username, full_name')
      .eq('id', decoded.userId)
      .single();
    
    console.log('Database result:', { user, error });

    if (error) {
      return NextResponse.json({
        error: 'Database error',
        debug: {
          userId: decoded.userId,
          errorCode: error.code,
          errorMessage: error.message,
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        decoded,
        user,
        matched: user?.id === decoded.userId,
      }
    });
  } catch (error) {
    console.error('Test me error:', error);
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
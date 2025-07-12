import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No token provided',
        hasAuthHeader: !!request.headers.get('authorization'),
      });
    }

    const decoded = verifyToken(token);
    
    return NextResponse.json({
      success: true,
      data: {
        hasToken: !!token,
        tokenLength: token.length,
        decoded: decoded,
        isValidToken: !!decoded,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Debug token error:', error);
    return NextResponse.json({
      success: false,
      error: 'Token debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
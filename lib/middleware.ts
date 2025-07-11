import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './auth';
import { AuthUser } from '@/types/user';

export interface AuthenticatedRequest extends NextRequest {
  user: AuthUser;
}

export const withAuth = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 },
        );
      }

      const user = verifyToken(token);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 },
        );
      }

      (req as AuthenticatedRequest).user = user;
      return handler(req as AuthenticatedRequest);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 },
      );
    }
  };
};

export const withAdminAuth = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) => {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 },
      );
    }
    return handler(req);
  });
};

export const withSuperAdminAuth = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) => {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Super admin access required' },
        { status: 403 },
      );
    }
    return handler(req);
  });
};

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const handleCors = (req: NextRequest) => {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }
  return null;
};

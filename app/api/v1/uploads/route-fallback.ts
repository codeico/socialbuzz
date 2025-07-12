import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // For now, return a default avatar URL
    const defaultAvatars = [
      'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=200',
      'https://ui-avatars.com/api/?name=Creator&background=8b5cf6&color=fff&size=200',
      'https://ui-avatars.com/api/?name=Admin&background=059669&color=fff&size=200',
    ];

    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    return NextResponse.json({
      success: true,
      data: {
        filename: 'default-avatar.png',
        originalName: 'default-avatar.png',
        mimetype: 'image/png',
        size: 0,
        url: randomAvatar,
        path: 'default/avatar.png',
      },
      message: 'Storage not configured. Using default avatar.',
    });
  } catch (error) {
    console.error('Upload fallback error:', error);
    return NextResponse.json({ success: false, error: 'Upload service temporarily unavailable' }, { status: 500 });
  }
}

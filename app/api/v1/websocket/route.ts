import { NextRequest, NextResponse } from 'next/server';
import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { wsManager } from '@/lib/websocket';

export const config = {
  api: {
    bodyParser: false,
  },
};

// This will be handled by a separate WebSocket server
// For development, you can run this alongside Next.js
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'WebSocket server should be running separately',
    endpoints: {
      connect: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
      status: 'Use Socket.IO client to connect',
    },
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      error: 'WebSocket connections should use Socket.IO client',
    },
    { status: 400 },
  );
}

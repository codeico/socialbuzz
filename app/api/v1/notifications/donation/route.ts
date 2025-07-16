import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { transactionId, creatorId, donorName, amount, message, isAnonymous } = await request.json();

    if (!transactionId || !creatorId || !donorName || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get creator information
    const { data: creator, error: creatorError } = await supabase
      .from('users')
      .select('id, username, full_name')
      .eq('id', creatorId)
      .single();

    if (creatorError || !creator) {
      console.error('Error fetching creator:', creatorError);
      return NextResponse.json(
        { success: false, error: 'Creator not found' },
        { status: 404 }
      );
    }

    // Create donation notification object
    const donationNotification = {
      id: transactionId,
      donorName: isAnonymous ? 'Anonymous' : donorName,
      amount: amount,
      message: message || '',
      timestamp: new Date().toISOString(),
      creatorId: creator.id,
      creatorUsername: creator.username,
      isAnonymous: isAnonymous || false,
      currency: 'IDR',
    };

    // Check if WebSocket server is available
    const wsServer = (global as any).wsServer;
    if (wsServer) {
      // Emit donation notification to all connected clients for this creator
      wsServer.to(`creator-${creatorId}`).emit('donation-alert', donationNotification);
      wsServer.to(`obs-${creatorId}`).emit('donation-alert', donationNotification);
      wsServer.to(`widget-${creatorId}`).emit('donation-alert', donationNotification);

      console.log(`Donation notification sent to creator ${creatorId}:`, donationNotification);
    } else {
      console.warn('WebSocket server not available');
      return NextResponse.json(
        { success: false, error: 'WebSocket server not available' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Donation notification sent successfully',
        donation: donationNotification
      }
    });

  } catch (error) {
    console.error('Error sending donation notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
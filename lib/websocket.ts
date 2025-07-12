import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';

interface DonationNotification {
  id: string;
  donorName: string;
  amount: number;
  message: string;
  timestamp: string;
  creatorId: string;
  creatorUsername: string;
  isAnonymous: boolean;
  currency: string;
}

interface CreatorRoom {
  creatorId: string;
  socketId: string;
  isActive: boolean;
}

class WebSocketManager {
  private io: SocketIOServer | null = null;
  private creatorRooms: Map<string, CreatorRoom[]> = new Map();
  private donationQueue: Map<string, DonationNotification[]> = new Map();

  initialize(server: any) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', socket => {
      console.log('Client connected:', socket.id);

      // Handle creator joining their room for OBS overlay
      socket.on('join-creator-room', async data => {
        try {
          const { creatorId, token } = data;

          // Verify token if provided (for authenticated connections)
          if (token) {
            const decoded = verifyToken(token);
            if (!decoded || decoded.userId !== creatorId) {
              socket.emit('error', { message: 'Unauthorized' });
              return;
            }
          }

          const roomName = `creator-${creatorId}`;
          socket.join(roomName);

          // Store creator room info
          const rooms = this.creatorRooms.get(creatorId) || [];
          rooms.push({
            creatorId,
            socketId: socket.id,
            isActive: true,
          });
          this.creatorRooms.set(creatorId, rooms);

          console.log(`Creator ${creatorId} joined room: ${roomName}`);

          // Send queued donations if any
          const queuedDonations = this.donationQueue.get(creatorId) || [];
          if (queuedDonations.length > 0) {
            queuedDonations.forEach(donation => {
              socket.emit('donation-alert', donation);
            });
            this.donationQueue.delete(creatorId);
          }

          socket.emit('room-joined', { roomName, creatorId });
        } catch (error) {
          console.error('Error joining creator room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Handle OBS overlay connection
      socket.on('join-obs-overlay', data => {
        try {
          const { creatorId, overlayId } = data;
          const roomName = `obs-${creatorId}`;
          socket.join(roomName);

          console.log(`OBS overlay ${overlayId} joined room: ${roomName}`);
          socket.emit('overlay-connected', { roomName, creatorId, overlayId });
        } catch (error) {
          console.error('Error joining OBS overlay:', error);
          socket.emit('error', { message: 'Failed to connect overlay' });
        }
      });

      // Handle donation widget connection
      socket.on('join-donation-widget', data => {
        try {
          const { creatorId, widgetId } = data;
          const roomName = `widget-${creatorId}`;
          socket.join(roomName);

          console.log(`Donation widget ${widgetId} joined room: ${roomName}`);
          socket.emit('widget-connected', { roomName, creatorId, widgetId });
        } catch (error) {
          console.error('Error joining donation widget:', error);
          socket.emit('error', { message: 'Failed to connect widget' });
        }
      });

      // Handle test donation (for testing purposes)
      socket.on('test-donation', data => {
        try {
          const { creatorId } = data;
          const testDonation: DonationNotification = {
            id: `test-${Date.now()}`,
            donorName: 'Test Donor',
            amount: 50000,
            message: 'This is a test donation! 🎉',
            timestamp: new Date().toISOString(),
            creatorId,
            creatorUsername: 'testcreator',
            isAnonymous: false,
            currency: 'IDR',
          };

          this.broadcastDonation(testDonation);
          socket.emit('test-donation-sent', testDonation);
        } catch (error) {
          console.error('Error sending test donation:', error);
          socket.emit('error', { message: 'Failed to send test donation' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        this.cleanupCreatorRooms(socket.id);
      });
    });

    return this.io;
  }

  // Broadcast donation to all connected clients for a creator
  broadcastDonation(donation: DonationNotification) {
    if (!this.io) {
      return;
    }

    const creatorId = donation.creatorId;

    // Send to creator's main room
    this.io.to(`creator-${creatorId}`).emit('donation-alert', donation);

    // Send to OBS overlay
    this.io.to(`obs-${creatorId}`).emit('donation-alert', donation);

    // Send to donation widget
    this.io.to(`widget-${creatorId}`).emit('donation-alert', donation);

    // Store in queue if no active connections
    const rooms = this.creatorRooms.get(creatorId) || [];
    if (rooms.length === 0) {
      const queue = this.donationQueue.get(creatorId) || [];
      queue.push(donation);
      this.donationQueue.set(creatorId, queue);
    }

    console.log(`Broadcasted donation to creator ${creatorId}:`, donation);
  }

  // Send donation notification from payment callback
  sendDonationNotification(donation: DonationNotification) {
    this.broadcastDonation(donation);
  }

  // Clean up disconnected creator rooms
  private cleanupCreatorRooms(socketId: string) {
    this.creatorRooms.forEach((rooms, creatorId) => {
      const updatedRooms = rooms.filter(room => room.socketId !== socketId);
      if (updatedRooms.length === 0) {
        this.creatorRooms.delete(creatorId);
      } else {
        this.creatorRooms.set(creatorId, updatedRooms);
      }
    });
  }

  // Get server instance
  getServer() {
    return this.io;
  }
}

export const wsManager = new WebSocketManager();
export type { DonationNotification, CreatorRoom };

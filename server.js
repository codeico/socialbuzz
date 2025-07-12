const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

// Use same port for both HTTP and WebSocket

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory storage for demo purposes
// In production, use Redis or a database
const creatorRooms = new Map();
const donationQueue = new Map();

app.prepare().then(() => {
  // Create HTTP server for both Next.js and Socket.IO
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  // Attach Socket.IO to the same server
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    // Handle creator joining their room for OBS overlay
    socket.on('join-creator-room', async data => {
      try {
        const { creatorId, token } = data;

        const roomName = `creator-${creatorId}`;
        socket.join(roomName);

        // Store creator room info
        const rooms = creatorRooms.get(creatorId) || [];
        rooms.push({
          creatorId,
          socketId: socket.id,
          isActive: true,
        });
        creatorRooms.set(creatorId, rooms);

        console.log(`Creator ${creatorId} joined room: ${roomName}`);

        // Send queued donations if any
        const queuedDonations = donationQueue.get(creatorId) || [];
        if (queuedDonations.length > 0) {
          queuedDonations.forEach(donation => {
            socket.emit('donation-alert', donation);
          });
          donationQueue.delete(creatorId);
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

    // Handle test donation
    socket.on('test-donation', data => {
      try {
        const { creatorId } = data;
        const testDonation = {
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

        // Broadcast to all rooms for this creator
        io.to(`creator-${creatorId}`).emit('donation-alert', testDonation);
        io.to(`obs-${creatorId}`).emit('donation-alert', testDonation);
        io.to(`widget-${creatorId}`).emit('donation-alert', testDonation);

        console.log(`Test donation sent to creator ${creatorId}:`, testDonation);
        socket.emit('test-donation-sent', testDonation);
      } catch (error) {
        console.error('Error sending test donation:', error);
        socket.emit('error', { message: 'Failed to send test donation' });
      }
    });

    // Handle real donation notification
    socket.on('donation-notification', donation => {
      try {
        const creatorId = donation.creatorId;

        // Broadcast to all rooms for this creator
        io.to(`creator-${creatorId}`).emit('donation-alert', donation);
        io.to(`obs-${creatorId}`).emit('donation-alert', donation);
        io.to(`widget-${creatorId}`).emit('donation-alert', donation);

        console.log(`Donation notification sent to creator ${creatorId}:`, donation);
      } catch (error) {
        console.error('Error sending donation notification:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Clean up creator rooms
      creatorRooms.forEach((rooms, creatorId) => {
        const updatedRooms = rooms.filter(room => room.socketId !== socket.id);
        if (updatedRooms.length === 0) {
          creatorRooms.delete(creatorId);
        } else {
          creatorRooms.set(creatorId, updatedRooms);
        }
      });
    });
  });

  // Start server
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Next.js server with Socket.IO ready on http://${hostname}:${port}`);
  });

  // Expose WebSocket server for API routes
  global.wsServer = io;
});

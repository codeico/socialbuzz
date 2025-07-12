import { Server as SocketIOServer } from 'socket.io';

declare global {
  var wsServer: SocketIOServer | undefined;
}

export {};

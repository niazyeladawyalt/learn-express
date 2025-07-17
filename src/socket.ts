// socket.ts
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export function initSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('🟢 A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);
    });
  });
}

/**
 * Get initialized Socket.IO server instance.
 * Throws if called before initSocket().
 */
export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  }
  return io;
}

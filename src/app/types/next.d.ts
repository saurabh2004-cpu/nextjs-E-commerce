import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

// next.d.ts
import { Multer } from 'multer';

declare module 'next' {
  interface NextApiRequest {
    file?: Multer.File;
  }
}

declare module 'next' {
  export interface NextApiRequest {
    files?: {
      [key: string]: Express.Multer.File[];
    };
    file?: Express.Multer.File;
  }
}

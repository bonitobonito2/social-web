import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketOn } from "../enums/socket.enum";
import { SocketService } from "../service/socket.service";

class SocketServer {
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.io = new Server(server, {
      cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
      },
    });

    this.io.on(SocketOn.CONNECTION, async (socket: Socket) => {
      const socketService = SocketService.getInstance(this.io, socket);

      await socketService.handleConnection();

      socket.on(SocketOn.JOIN, () => {
        socketService.joinToRoom();
      });

      socket.on(SocketOn.MESSAGE, (message) => {
        socketService.sendMessage(message);
      });

      socket.on(SocketOn.DISCONNECT, async () => {
        await socketService.disconnect();
      });
    });
  }

  start(): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
    return this.io;
  }
}

export const startSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> => {
  const socketServer = new SocketServer(server);
  return socketServer.start();
};

import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketOn } from "../enums/socket.enum";
import { SocketService } from "../service/socket.service";
import { instrument } from "@socket.io/admin-ui";

class SocketServer {
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.io = new Server(server, {
      cors: {
        origin: ["https://admin.socket.io", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    instrument(this.io, {
      auth: false,
    });
    this.io.on(SocketOn.CONNECTION, async (socket: Socket) => {
      const socketService = SocketService.getInstance(this.io, socket);
      await socketService.handleConnection();

      socket.on(SocketOn.JOIN, async (data) => {
        await socketService.joinToRoom(data);
      });

      socket.on(SocketOn.MESSAGE, async (message) => {
        await socketService.sendMessage(message);
      });

      socket.on(SocketOn.DISCONNECT, async () => {
        console.log("disconnecting");
        await socketService.disconnect("unknown");
      });
    });
  }

  getSocketInstance(): Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  > {
    return this.io;
  }
}

export const getSocketInstance = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> => {
  const socketServer = new SocketServer(server);
  return socketServer.getSocketInstance();
};

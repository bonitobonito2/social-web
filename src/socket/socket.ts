import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SocketOn } from "../enums/socket.enum";
import { SocketService } from "../service/socket.service";

export const startSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> => {
  const io = new Server(server, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
  });

  io.on(SocketOn.CONNECTION, async (socket: Socket) => {
    const socketService = SocketService.getInstance(io, socket);

    socketService.handleConnection();

    socket.on(SocketOn.JOIN, () => {
      socketService.joinToRoom();
    });

    socket.on(SocketOn.MESSAGE, (message) => {
      socketService.sendMessage(message);
    });

    socket.on(SocketOn.DISCONNECT, async () => {
      socketService.disconnect();
    });
  });

  return io;
};

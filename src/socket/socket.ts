import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { redisService } from "../service/redis.service";
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
    new SocketService(io, socket).handleConnection();

    socket.on(SocketOn.JOIN, () => {
      new SocketService(io, socket).joinToRoom();
    });
    socket.on(SocketOn.MESSAGE, (message) =>
      new SocketService(io, socket).sendMessage(message)
    );

    socket.on(SocketOn.DISCONNECT, async () => {
      new SocketService(io, socket).disconnect();
    });
  });

  return io;
};

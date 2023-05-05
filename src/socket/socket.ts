import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { redisService } from "../service/redis.service";
import { SocketService } from "../service/socket.service";
export const startSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> => {
  const redis = redisService;

  const io = new Server(server, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
  });
  io.on("connection", async (socket: Socket) => {
    new SocketService(io, socket).handleConnection();

    socket.on("join", () => {
      new SocketService(io, socket).joinToRoom();
    });
    socket.on("message", (message) =>
      new SocketService(io, socket).sendMessage(message)
    );

    socket.on("disconnect", async () => {
      new SocketService(io, socket).disconnect();
    });
  });

  return io;
};

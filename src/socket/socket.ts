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
    const email = socket.handshake.query.email;
    console.log(await redis.getAllUsers());
    if (email == undefined) socket.emit("error", "no param email");
    console.log(email);
    await redis.setSocketClient(
      typeof email == "string" ? email : email[0],
      socket.id
    );

    socket.on("join", () => {
      socket.join("room");
      const hey = io.sockets.adapter.rooms.get("room");
      console.log(hey);
      socket.emit("join", "joined");
    });
    // listen for a message from the client
    socket.on("message", (message) =>
      new SocketService(io, socket, message).sendMessage()
    );

    socket.on("disconnect", async () => {
      await redisService.removeClientId(socket.id);
      console.log("user disconnected");
    });
  });

  return io;
};

import http from "http";
import { Server, Socket } from "socket.io";

export const startSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("join", () => {
      socket.join("room");
      const hey = io.sockets.adapter.rooms.get("room");
      console.log(hey);
      socket.emit("join", "joined");
    });
    // listen for a message from the client
    socket.on("message", (msg: string) => {
      const roomUsers = io.sockets.adapter.rooms.get("room");

      if (roomUsers?.has(socket.id)) {
        io.to("room").emit("message", { sent: msg });
      } else {
        socket.emit("error", "not room user");
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

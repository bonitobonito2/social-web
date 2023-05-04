import http from "http";
import { Server, Socket } from "socket.io";

export const startSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new Server(server);

  io.on("connection", (socket: Socket) => {
    // listen for a message from the client
    socket.on("message", (msg: string) => {
      io.emit("message", { sent: msg });
      console.log(`received message: ${msg}`);
    });

    // listen for the 'disconnect' event
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

import { Server, Socket } from "socket.io";
import { redisService } from "./redis.service";
import { SocketEmit } from "../enums/socket.enum";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { validateTokenFunction } from "../middlewares/validateToken.middleware";
import { JwtPayload } from "jsonwebtoken";

export class SocketService {
  private static instance: SocketService;
  private redisService = redisService;

  private constructor(
    private io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >,
    private socket: Socket
  ) {
    // Initialize the SocketService
  }

  public sendMessage(message: string) {
    const roomUsers = this.io.sockets.adapter.rooms.get("room");
    const data = JSON.parse(message);

    if (roomUsers?.has(this.socket.id)) {
      this.io.to("room").emit(SocketEmit.MESSAGE, { sent: data["key"] });
    } else {
      this.socket.emit(SocketEmit.ERROR, "not room user");
    }
  }

  public joinToRoom() {
    this.socket.join("room");

    this.socket.emit(SocketEmit.JOIN, "joined");
  }

  public async disconnect() {
    await redisService.removeClientId(this.socket.id);
  }

  private validateToken() {
    try {
      const token = this.socket.handshake.headers.token;
      return validateTokenFunction(typeof token == "string" ? token : token[0]);
    } catch (err) {
      throw err;
    }
  }

  private async saveSocketClientInRedis(
    userId: string | string[],
    socketId: string
  ) {
    await this.redisService.setSocketClient(
      typeof userId == "string" ? userId : userId[0],
      socketId
    );
  }

  public async handleConnection() {
    try {
      const decoded: string | JwtPayload = this.validateToken();

      await this.saveSocketClientInRedis(decoded["id"], this.socket.id);
    } catch (err) {
      this.socket.emit(SocketEmit.ERROR, err);

      this.socket.disconnect();
    }
  }

  public static getInstance(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket
  ): SocketService {
    console.log("getting instance");
    console.log(socket.id);

    if (!SocketService.instance) {
      SocketService.instance = new SocketService(io, socket);
    }
    return SocketService.instance;
  }

  // Rest of the SocketService methods
}

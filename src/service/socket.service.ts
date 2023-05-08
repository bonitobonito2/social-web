import { Server, Socket } from "socket.io";
import { SocketEmit } from "../enums/socket.enum";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { validateTokenFunction } from "../middlewares/validateToken.middleware";
import { redisClass, redisService } from "./redis.service";
import { JwtPayload } from "jsonwebtoken";
import { AuthService } from "./auth.service";

export class SocketService {
  private static instance: SocketService;
  private authService: AuthService;
  private redisService: redisClass;

  private constructor(
    private io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >,
    private socket: Socket
  ) {
    this.authService = new AuthService();
    this.redisService = redisService;
  }

  public async sendMessage(message: string) {
    const roomUsers = this.io.sockets.adapter.rooms.get("room");
    const data = JSON.parse(message);

    if (roomUsers?.has(this.socket.id))
      this.socket.to("room").emit(SocketEmit.MESSAGE, { sent: data["key"] });
    else this.socket.emit(SocketEmit.ERROR, "not room user");
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
      const validated = validateTokenFunction(
        typeof token == "string" ? token : token[0]
      );
      return validated;
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

      this.socket.emit("connection", true);
    } catch (err) {
      console.log(err);
      this.socket.emit(SocketEmit.ERROR, err);

      this.socket.disconnect();
    }
  }

  public static getInstance(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket
  ): SocketService {
    return (SocketService.instance = new SocketService(io, socket));
  }

  // Rest of the SocketService methods
}

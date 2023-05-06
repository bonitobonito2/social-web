import { Server, Socket } from "socket.io";
import { redisService } from "./redis.service";
import { SocketEmit } from "../enums/socket.enum";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AuthService } from "./auth.service";
import {
  validateToken,
  validateTokenFunction,
} from "../middlewares/validateToken.middleware";
import { decode } from "punycode";
import { JwtPayload } from "jsonwebtoken";

export class SocketService {
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  private socket: Socket;
  private redisService = redisService;
  private message: string;
  constructor(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    socket: Socket
  ) {
    this.io = io;
    this.socket = socket;
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
}

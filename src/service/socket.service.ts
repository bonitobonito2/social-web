import { Server, Socket } from "socket.io";
import { SocketEmit, SocketOn } from "../enums/socket.enum";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { validateTokenFunction } from "../middlewares/validateToken.middleware";
import { redisClass, redisService } from "./redis.service";
import { JwtPayload } from "jsonwebtoken";
import { AuthService } from "./auth.service";
import { ChatService } from "./chat.service";

export class SocketService {
  private static instance: SocketService;
  private authService: AuthService;
  private chatService = new ChatService();
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
    try {
      const roomUser = this.io.sockets.adapter.rooms
        .get("room4")
        ?.has(this.socket.id);

      const data = JSON.parse(message);
      const id = await this.redisService.getClientBySocketId(
        this.socket.id.toString()
      );

      const user = await this.authService.getUserById(parseInt(id?.toString()));

      if (roomUser) {
        this.socket.emit(SocketEmit.SENT, data["key"]);
        this.socket.emit(SocketEmit.MESSAGE, {
          sent: data["key"],
          email: user.email,
        });
        this.socket
          .to("room4")
          .emit(SocketEmit.MESSAGE, { sent: data["key"], email: user.email });
      } else {
        this.socket.emit(SocketEmit.ERROR, "not room user");
      }
    } catch (err) {
      this.socket.emit(SocketEmit.JOIN, err);
    }
  }

  public async joinToRoom(data) {
    try {
      const chatId = data["chatId"];
      const userId = await this.redisService.getClientBySocketId(
        this.socket.id
      );
      await this.chatService.checkIfUserIsInChat(
        parseInt(userId.toString()),
        chatId
      );
      this.socket.join("room" + chatId);
      this.socket.emit(SocketEmit.JOIN, "room" + chatId);
    } catch (err) {
      this.socket.emit(SocketEmit.ERROR, err);
      // throw err;
    }
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

      await this.redisService.removeSocketIdByUserId(decoded["id"]);
      await this.saveSocketClientInRedis(decoded["id"], this.socket.id);

      this.socket.emit(SocketOn.CONNECTION, true);
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

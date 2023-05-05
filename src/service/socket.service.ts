import { Server, Socket } from "socket.io";
import { redisService } from "./redis.service";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

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

    if (roomUsers?.has(this.socket.id)) {
      this.io.to("room").emit("message", { sent: message });
    } else {
      this.socket.emit("error", "not room user");
    }
  }

  public joinToRoom() {
    this.socket.join("room");
    this.socket.emit("join", "joined");
  }

  public async disconnect() {
    await redisService.removeClientId(this.socket.id);
  }

  public async handleConnection() {
    const id = this.socket.handshake.query.id;

    if (id == undefined) this.socket.emit("error", "no param id");

    await this.redisService.setSocketClient(
      typeof id == "string" ? id : id[0],
      this.socket.id
    );
  }
}

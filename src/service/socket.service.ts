export class SocketService {
  private io;
  private socket;
  private message: string;
  constructor(io, socket, message) {
    this.io = io;
    this.socket = socket;
    this.message = message;
  }

  public sendMessage() {
    const roomUsers = this.io.sockets.adapter.rooms.get("room");

    if (roomUsers?.has(this.socket.id)) {
      this.io.to("room").emit("message", { sent: this.message });
    } else {
      this.socket.emit("error", "not room user");
    }
  }
}

import { myDataSource } from "../database/db.config";
import { chat } from "../entities/chat.entity";
import { Messages } from "../entities/message.entity";
import { datetime } from "../helper/helper";
import { AuthService } from "./auth.service";
import { ChatService } from "./chat.service";

export class MessagesService {
  public messagesRepo = myDataSource.getRepository(Messages);
  private chatService = new ChatService();
  private userService = new AuthService();
  public async saveMessge(content: string, chatId: number, userId: number) {
    try {
      const chat = await this.chatService.getChatById(chatId);
      const user = await this.userService.getUserById(userId);
      console.log(datetime());
      return await this.messagesRepo.save({
        content: content,
        createdAt: datetime(),
        user: user,
        chat: chat,
      });
    } catch (err) {
      throw err;
    }
  }

  public async deleteAllMessages() {
    try {
      await this.messagesRepo.query("delete from message");
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async getChatMessages(chatId: number) {
    try {
      const chat = await this.chatService.getChatById(chatId);
      const messages = await this.messagesRepo.find({
        where: { chat: chat },
        relations: { user: true, chat: true },
        select: { user: { id: true, email: true }, chat: { id: true } },
      });
      return messages;
    } catch (err) {}
  }
}

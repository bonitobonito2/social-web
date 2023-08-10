import { myDataSource } from "../database/db.config";
import { chat } from "../entities/chat.entity";
import { FriendsService } from "./friends.service";
import { User } from "../entities/user.entity";
import { AuthService } from "./auth.service";
import { datetime } from "../helper/helper";

export class ChatService {
  public userRepo = myDataSource.getRepository(User);
  public chatRepo = myDataSource.getRepository(chat);
  private userService = new AuthService();
  public friends = new FriendsService();

  private containsCommonElement(arr1, arr2) {
    return arr1.some((elem1) => arr2.includes(elem1));
  }

  public async getChatById(id: number) {
    try {
      const chat = this.chatRepo.findOneBy({ id: id });
      if (!chat) throw "chat doesnot exsists";
      return chat;
    } catch (err) {
      throw err;
    }
  }
  public async checkIfTwoPersonHaveAChat(user1: User, user2: User) {
    try {
      const user1Chats = await this.chatRepo.find({
        where: { user: user1 },

        relations: { user: true },
      });

      const user2Chats = await this.chatRepo.find({
        where: { user: user2 },

        relations: { user: true },
      });
      const user1ChatIds = user1Chats.map((chat) => chat.id);
      const user2ChatIds = user2Chats.map((chat) => chat.id);
      return this.containsCommonElement(user1ChatIds, user2ChatIds);
    } catch (err) {
      throw err;
    }
  }

  public checkIfUserIsInChat = async (userId: number, chatId: number) => {
    try {
      const userExsits = await this.userService.getUserById(userId);
      console.log(userExsits, "userexsits");
      return await this.chatRepo.findOneOrFail({
        where: { user: userExsits, id: chatId },
      });
    } catch (err) {
      throw err;
    }
  };

  private getChatWithUserRelationship = async (chatId: number) => {
    return this.chatRepo.find({
      where: { id: chatId },
      relations: { user: true },
    });
  };

  public addChatMember = async (chat_id: number, userEmail: string) => {
    const chat = await this.getChatWithUserRelationship(chat_id);
    const user = await this.userService.getUser(userEmail);

    chat[0].user = [...chat[0].user, user];
    await this.chatRepo.save(chat);
  };
  public createChat = async (user1Id: number, user2Id: number) => {
    try {
      const user1 = await this.userService.getUserById(user1Id);
      const user2 = await this.userService.getUserById(user2Id);
      const friends = await this.friends.checkIfFriends(user1, user2);
      if (!friends) throw "not friends";
      const chatExsists = await this.checkIfTwoPersonHaveAChat(user1, user2);
      if (chatExsists) throw "chat alraedy exsits";
      const createChat = await this.chatRepo.save({
        name: "test",
        user: [user1, user2],
        createdAt: datetime(),
      });
      return createChat;
    } catch (err) {
      throw err;
    }
  };
}

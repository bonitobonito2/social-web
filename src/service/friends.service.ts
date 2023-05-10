import { myDataSource } from "../database/db.config";
import { Friends } from "../entities/friends.entity";
import { AuthService } from "./auth.service";
import { User } from "../entities/user.entity";

export class FriendsService {
  private friendsRepo = myDataSource.getRepository(Friends);
  private userService = new AuthService();

  public async checkIfFriends(user1: User, user2: User): Promise<boolean> {
    try {
      const isUser1FriendOfUser2 = await this.friendsRepo.findOneBy({
        user: user1,
        friend: user2,
      });

      const isUser2FriendOfUser1 = await this.friendsRepo.findOneBy({
        user: user2,
        friend: user1,
      });

      return isUser2FriendOfUser1 && isUser1FriendOfUser2 ? true : false;
    } catch (err) {
      throw err;
    }
  }
}

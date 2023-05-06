import { User } from "../entities/user.entity";
import { myDataSource } from "../database/db.config";
import { io } from "..";
import { friendRequests } from "../entities/sendFriendRequest.entity";
import { datetime } from "../helper/helper";
import { redisService } from "./redis.service";
import { FriendRequestResponse } from "../enums/friendRequestRespons.enum";
import { Friends } from "../entities/friends.entity";
import { SocketEmit } from "../enums/socket.enum";

export class RequestService {
  public userRepo = myDataSource.getRepository(User);
  public requestRepo = myDataSource.getRepository(friendRequests);
  public friendsRepo = myDataSource.getRepository(Friends);
  private redis = redisService;
  async requestExsists(
    sender: User,
    friend: User,
    status: string
  ): Promise<friendRequests> {
    try {
      const friendRequestExsists = await this.requestRepo.findOneBy({
        sender: sender,
        reciver: friend,
        status: status,
      });

      return friendRequestExsists;
    } catch (err) {
      throw err;
    }
  }

  async handleInvatation(sender: User, friend: User, status: string) {
    try {
      const requestExsists = await this.requestExsists(
        sender,
        friend,
        "pending"
      );
      if (!requestExsists) throw "request doesnot exsitsts";

      switch (status) {
        case FriendRequestResponse.ACCEPTED:
          requestExsists.status = FriendRequestResponse.ACCEPTED;
          await this.requestRepo.save(requestExsists);
          await this.friendsRepo.save({
            user: friend,
            friend: sender,
            createdAt: datetime(),
          });
          await this.friendsRepo.save({
            user: sender,
            friend: friend,
            createdAt: datetime(),
          });

          break;
        case FriendRequestResponse.REJECTED:
          requestExsists.status = FriendRequestResponse.REJECTED;
          return await this.requestRepo.save(requestExsists);

        default:
          throw "not valid status code";
      }
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async sendRequest(sender: User, friend: User): Promise<friendRequests> {
    try {
      const friendRequestExsists = await this.requestExsists(
        sender,
        friend,
        "pending"
      );
      if (friendRequestExsists) {
        throw "request already sent";
      }

      const sendRequest = await this.requestRepo.save({
        sender: sender,
        reciver: friend,
        status: "pending",
        createdAt: datetime(),
      });
      const friendSocketId = await this.redis.getClientId(friend.email);

      if (friendSocketId)
        io.to(friendSocketId).emit(SocketEmit.NOTIFICATION, {
          sender: sender.email,
          friend: friend.email,
          status: "pending",
        });

      return sendRequest;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

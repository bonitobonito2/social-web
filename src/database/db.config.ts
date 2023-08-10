import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Friends } from "../entities/friends.entity";
import { Messages } from "../entities/message.entity";
import { User } from "../entities/user.entity";
import { chat } from "../entities/chat.entity";
import { UserDetails } from "../entities/userDetails.entity";
import { friendRequests } from "../entities/sendFriendRequest.entity";
// import { userChatrooms } from "../entities/userChatRooms.entity";

dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: "db", // Use the service name "db" defined in your Docker Compose
  port: 5432, // Default PostgreSQL port
  username: "social",
  database: "social",
  password: "social",
  entities: [UserDetails, User, Friends, friendRequests, chat, Messages],
  synchronize: true,
});

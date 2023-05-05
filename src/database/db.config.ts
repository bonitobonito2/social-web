import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Friends } from "../entities/friends.entity";
import { User } from "../entities/user.entity";
import { chat } from "../entities/chat.entity";
import { UserDetails } from "../entities/userDetails.entity";
import { friendRequests } from "../entities/sendFriendRequest.entity";

dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_MASTER_HOST,
  port: parseInt(process.env.DATABASE_PORT), // or the port number you are using
  username: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [UserDetails, User, Friends, friendRequests, chat],
  synchronize: true,
});

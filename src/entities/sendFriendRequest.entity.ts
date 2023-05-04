import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
import { FriendRequestResponse } from "../enums/friendRequestRespons.enum";

@Entity("friendRequests")
export class friendRequests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: FriendRequestResponse })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn()
  reciver: User;

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}

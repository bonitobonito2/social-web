import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";

import { Messages } from "./message.entity";

import { User } from "./user.entity";

@Entity("chat")
export class chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.chat)
  @JoinTable({ name: "userChatrooms" })
  user: User[];

  @OneToMany(() => Messages, (message) => message.user)
  message: Messages[];

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}

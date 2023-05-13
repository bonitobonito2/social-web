import { chat } from "./chat.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";

@Entity("message")
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.message)
  @JoinColumn()
  user: User;
  @ManyToOne(() => chat, (chat) => chat.message)
  @JoinColumn()
  chat: chat;

  @Column()
  content: string;

  @Column({ type: "timestamptz", precision: 3 })
  createdAt: Date | null;
}

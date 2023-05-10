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

  @ManyToOne(() => chat, (chat) => chat.message)
  @JoinColumn()
  chat: chat;

  @ManyToOne(() => chat, (chat) => chat.message)
  @JoinColumn()
  user: User;

  @Column()
  content: string;

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}

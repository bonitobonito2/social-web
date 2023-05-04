import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";

@Entity("friends")
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => User)
  @JoinColumn()
  friend: User;

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enums/gender.enum";
@Entity("userDetails")
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  age: number;

  @Column({ enum: Gender })
  gender: string;

  @Column()
  city: string;

  @Column("timestamp without time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;
}

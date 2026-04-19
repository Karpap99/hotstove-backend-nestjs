import { Entity, Unique, ManyToOne, Index, Column, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
@Unique(["followedId", "followerId"])
export class Follower extends BaseEntity {
  @Index()
  @Column()
  followedId!: string;

  @Index()
  @Column()
  followerId!: string;

  @ManyToOne(() => User, (user) => user.following, { onDelete: "CASCADE" })
  @JoinColumn({ name: "followedId" })
  followed!: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "followerId" })
  follower!: User;
}

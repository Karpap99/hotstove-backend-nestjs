import { Entity, Column, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Post } from "./post.entity";
import { Likes } from "./likes.entity";
import { Profile } from "./profile.entity";
import { Follower } from "./follower.entity";
import { Message } from "./message.entity";

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @Column({ default: 0 })
  followersCount!: number;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @OneToMany(() => Post, (post) => post.creator)
  posts!: Post[];

  @OneToMany(() => Likes, (like) => like.likeBy)
  likes!: Likes[];

  @OneToMany(() => Follower, (f) => f.followed)
  followers!: Follower[];

  @OneToMany(() => Follower, (f) => f.follower)
  following!: Follower[];

  @OneToMany(() => Message, (msg) => msg.user)
  messages!: Message[];
}

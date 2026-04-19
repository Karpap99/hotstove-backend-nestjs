import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Post } from "./post.entity";
import { User } from "./user.entity";
import { MessageLike } from "./messageLike.entity";

@Entity()
export class Message extends BaseEntity {
  @Index()
  @Column()
  postId!: string;

  @JoinColumn({ name: "postId" })
  @ManyToOne(() => Post, (post) => post.messages, { onDelete: "CASCADE" })
  post!: Post;

  @Index()
  @Column()
  userId!: string;

  @JoinColumn({ name: "userId" })
  @ManyToOne(() => User, (user) => user.messages, { onDelete: "CASCADE" })
  user!: User;

  @Column()
  text!: string;

  @Index()
  @Column()
  parentId!: string | null;

  @JoinColumn({ name: "parentId" })
  @ManyToOne(() => Message, (message) => message.submessages, {
    onDelete: "CASCADE",
    nullable: true,
  })
  parent!: Message | null;

  @Column({ default: 0 })
  likesCount!: number;

  @Column({ default: 0 })
  submessagesCount!: number;

  @OneToMany(() => Message, (message) => message.parent)
  submessages!: Message[];

  @OneToMany(() => MessageLike, (like) => like.message)
  likes!: MessageLike[];
}

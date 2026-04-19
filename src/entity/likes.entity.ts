import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
@Unique(["postId", "likeById"])
export class Likes extends BaseEntity {
  @Index()
  @Column()
  postId!: string;

  @Index()
  @Column()
  likeById!: string;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post!: Post;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "likeById" })
  likeBy!: User;
}

import { Entity, Column, OneToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Post } from "./post.entity";
import { element } from "src/post/dto/types";

@Entity()
export class Marking extends BaseEntity {
  @Index()
  @Column()
  postId!: string;

  @JoinColumn({ name: "postId" })
  @OneToOne(() => Post, (post) => post.marking, {
    onDelete: "CASCADE",
    nullable: false,
  })
  post!: Post;

  @Column({ type: "json" })
  marking!: element;
}

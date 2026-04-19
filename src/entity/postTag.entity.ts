import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Tag } from "./tag.entity";
import { Post } from "./post.entity";

@Entity()
export class PostTag extends BaseEntity {
  @Index()
  @Column()
  tagId!: string;

  @ManyToOne(() => Tag, (tag) => tag.postTags, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tagId" })
  tag!: Tag;

  @Index()
  @Column()
  postId!: string;

  @JoinColumn({ name: "postId" })
  @ManyToOne(() => Post, (post) => post.tags, { onDelete: "CASCADE" })
  post!: Post;
}

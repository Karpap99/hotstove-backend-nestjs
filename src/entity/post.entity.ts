import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Likes } from "./likes.entity";
import { Message } from "./message.entity";
import { PostTag } from "./postTag.entity";
import { Marking } from "./marking.entity";

@Entity()
export class Post extends BaseEntity {
  @Index()
  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: "" })
  title_picture!: string;

  @Index()
  @Column()
  creatorId!: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "creatorId" })
  creator!: User;

  @Column({ default: 0 })
  views!: number;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ default: 0 })
  messagesCount!: number;

  @OneToMany(() => PostTag, (tags) => tags.post, { cascade: true, eager: true })
  tags!: PostTag[];

  @OneToMany(() => Likes, (likes) => likes.post)
  likes!: Likes[];

  @OneToMany(() => Message, (msg) => msg.post)
  messages!: Message[];

  @OneToOne(() => Marking, (mrk) => mrk.post, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  marking!: Marking;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";
import { BaseEntity } from "./base.entity";

@Entity()
@Unique(["message", "user"])
export class MessageLike extends BaseEntity {
  @Index()
  @Column()
  messageId!: string;

  @JoinColumn({ name: "messageId" })
  @ManyToOne(() => Message, (message) => message.likes, { onDelete: "CASCADE" })
  message!: Message;

  @Index()
  @Column()
  userId!: string;

  @JoinColumn({ name: "userId" })
  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  user!: User;
}

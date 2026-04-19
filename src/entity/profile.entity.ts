import { Entity, Column, JoinColumn, OneToOne, Unique, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
@Unique(["user"])
export class Profile extends BaseEntity {
  @Index()
  @Column()
  userId!: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ default: "" })
  profile_picture!: string;

  @Column({ default: "" })
  description!: string;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  age!: Date;
}

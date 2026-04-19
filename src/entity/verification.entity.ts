import { Entity, Column, JoinColumn, OneToOne, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Verification extends BaseEntity {
  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  @Index()
  user!: User;

  @Column()
  verificationCode!: string;

  @Column()
  verified!: boolean;
}

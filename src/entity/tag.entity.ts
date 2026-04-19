import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PostTag } from "./postTag.entity";
import { TagTranslation } from "./tagTranslation.entity";

@Entity()
export class Tag extends BaseEntity {
  @Index()
  @Column()
  content!: string;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags!: PostTag[];

  @OneToMany(() => TagTranslation, (translation) => translation.tag)
  translations!: TagTranslation[];
}

import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Tag } from "./tag.entity";
import { Lang } from "./lang.entity";

@Entity()
export class TagTranslation extends BaseEntity {
  @ManyToOne(() => Tag, (tag) => tag.translations)
  tag!: Tag;

  @ManyToOne(() => Lang, (lang) => lang.translations)
  lang!: Lang;

  @Column()
  translate!: string;
}

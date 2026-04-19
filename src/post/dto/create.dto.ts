import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { Post } from "src/entity/post.entity";
import { User } from "src/entity/user.entity";
import { Likes } from "src/entity/likes.entity";

export class CreateDTO implements Readonly<CreateDTO> {
  @IsUUID()
  @IsOptional()
  id!: string;

  @ApiProperty({ required: true })
  title!: string;

  @ApiProperty({ required: false })
  description!: string;

  @ApiProperty({ required: false, default: "" })
  title_picture!: string;

  @ApiProperty({ required: false })
  marking!: string;

  @ApiProperty({ required: false })
  creator!: User;

  @ApiProperty({ required: false, default: 0 })
  views!: number;

  @ApiProperty({ required: false })
  likes!: Likes[];

  @ApiProperty({ required: false })
  tags!: string;

  public static from(dto: Partial<CreateDTO>) {
    const it = new CreateDTO();
    const result = Object.assign({}, it, dto);
    return result;
  }

  public static fromEntity(entity: Post) {
    return this.from({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      title_picture: entity.title_picture,
      creator: entity.creator,
      views: entity.views,
      likes: entity.likes,
    });
  }

  public static WithoutMarking(dto: CreateDTO) {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      title_picture: dto.title_picture,
      creator: dto.creator,
      views: dto.views,
      likes: dto.likes,
    };
  }

  public toEntity() {
    const it = new Post();
    return it;
  }
}

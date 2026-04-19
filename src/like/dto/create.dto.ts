import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { Post } from "src/entity/post.entity";
import { User } from "src/entity/user.entity";
import { Likes } from "src/entity/likes.entity";

export class CreateDTO implements Readonly<CreateDTO> {
  @IsUUID()
  @IsOptional()
  id!: string;
  @ApiProperty({ required: false, type: () => Post })
  post!: Post;

  @ApiProperty({ required: false, type: () => User })
  likeBy!: User;

  public static from(dto: Partial<CreateDTO>): CreateDTO {
    const it = new CreateDTO();
    Object.assign(it, dto);
    return it;
  }

  public static fromEntity(entity: Likes): CreateDTO {
    return this.from({
      id: entity.id,
      post: entity.post,
      likeBy: entity.likeBy,
    });
  }

  public toEntity(): Likes {
    const it = new Likes();
    it.id = this.id;
    it.post = this.post;
    it.likeBy = this.likeBy;
    return it;
  }
}

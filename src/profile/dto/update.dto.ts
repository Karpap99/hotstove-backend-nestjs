import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entity/user.entity";

export class UpdateDTO implements Readonly<UpdateDTO> {
  @ApiProperty({ required: false })
  file!: {
    uri: string;
    fileName: string;
    type: string;
  };

  @ApiProperty({ required: false })
  age!: string;

  @ApiProperty({ required: false, default: "" })
  description!: string;

  @ApiProperty({ required: false, default: true })
  isPublic!: string;

  public static from(dto: Partial<UpdateDTO>) {
    const it = new UpdateDTO();
    const result = Object.assign({}, it, dto);
    return result;
  }

  public toEntity() {
    const it = new User();
    it.updatedAt = new Date();
    it.createdAt = new Date();
    return it;
  }
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { User } from "src/entity/user.entity";
import { Profile } from "../../entity/profile.entity";

export class ProfileDTO implements Readonly<ProfileDTO> {
  @IsUUID()
  @IsOptional()
  id!: string;

  @ApiProperty({ required: false })
  user!: User;

  @ApiProperty({ required: true, default: new Date() })
  @IsNumber()
  age!: Date;

  @ApiProperty({ required: false, default: "" })
  @IsString()
  profile_picture!: string;

  @ApiProperty({ required: false, default: "" })
  @IsString()
  description!: string;

  public static from(dto: Partial<ProfileDTO>) {
    const it = new ProfileDTO();
    const result = Object.assign({}, it, dto);
    return result;
  }

  public static fromEntity(entity: Profile) {
    return this.from({
      id: entity.id,
      age: entity.age,
    });
  }

  public toEntity() {
    const it = new Profile();
    it.id = this.id;
    const date = new Date();
    it.updatedAt = date;
    it.createdAt = date;
    return it;
  }
}

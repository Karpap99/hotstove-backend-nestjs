import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class SignUpDto {
  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty()
  @IsString()
  public nickname!: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 4,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  public password!: string;

  @ApiProperty()
  @IsString()
  public passwordConfirm!: string;
}

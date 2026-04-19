import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 4,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  public password!: string;

  public static from(email: string, password: string) {
    const it = new LoginDto();
    it.email = email;
    it.password = password;
    return it;
  }
}

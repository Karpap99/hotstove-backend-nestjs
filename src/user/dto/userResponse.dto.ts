import { User } from "src/entity/user.entity";

export class UserResponse implements Readonly<UserResponse> {
  public id!: string;
  public email!: string;
  public nickname!: string;
  public profile_picture!: string;
  public age!: Date;
  public description!: string;

  public static from(dto: User) {
    const it = new UserResponse();
    it.id = dto.id;
    it.nickname = dto.nickname;
    it.email = dto.email;
    return it;
  }

  public toEntity() {
    const it = new User();
    it.id = this.id;
    it.nickname = this.nickname;
    const date = new Date();
    it.createdAt = date;
    it.updatedAt = date;
    return it;
  }
}

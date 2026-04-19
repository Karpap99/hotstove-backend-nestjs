import { UserResponse } from "../../user/dto/userResponse.dto";

export class AuthResponse {
  public access!: string;
  public refresh!: string;
  public user!: UserResponse;

  constructor(access: string, refresh: string, user: UserResponse) {
    this.access = access;
    this.refresh = refresh;
    this.user = user;
  }
}

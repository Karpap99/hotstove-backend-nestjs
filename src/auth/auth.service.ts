import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/sign-up.dto";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { TokenDto } from "./dto/token.dto";
import { UserResponse } from "../user/dto/userResponse.dto";
import { AuthResponse } from "./dto/authResponse.dto";

@UsePipes(new ValidationPipe({ transform: true }))
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async register(signUpDto: SignUpDto) {
    if (!(signUpDto.password == signUpDto.passwordConfirm))
      throw new BadRequestException();

    if (await this.userService.existByEmail(signUpDto.email))
      throw new BadRequestException();

    const user = await this.userService.Create({
      email: signUpDto.email,
      nickname: signUpDto.nickname,
      password: await this.hashString(signUpDto.password),
    });

    const { access, refresh } = this.getToken({
      uuid: user.id,
      email: user.email,
      nickname: user.nickname,
    });

    return new AuthResponse(access, refresh, UserResponse.from(user));
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) throw new BadRequestException();

    if (!(await bcrypt.compare(loginDto.password, user.password)))
      throw new BadRequestException();

    const { access, refresh } = this.getToken({
      uuid: user.id,
      email: user.email,
      nickname: user.nickname,
    });

    return new AuthResponse(access, refresh, UserResponse.from(user));
  }

  async refreshAuth(refreshToken: string) {
    const result: TokenDto = await this.verifyToken(refreshToken, "refresh");

    const user = await this.userService.getUserById(result.uuid);
    if (!user) throw new BadRequestException();

    const { access, refresh } = this.getToken({
      uuid: user.id,
      email: user.email,
      nickname: user.nickname,
    });

    return new AuthResponse(access, refresh, UserResponse.from(user));
  }

  async hashString(value: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(value, salt);
  }

  async verifyToken(token: string, type: "access" | "refresh") {
    try {
      return await this.jwtService.verifyAsync<TokenDto>(token, {
        secret:
          type === "access"
            ? this.configService.get<string>("SECRET_ACCESS")
            : this.configService.get<string>("SECRET_REFRESH"),
        ignoreExpiration: false,
        algorithms: ["HS256"],
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  getToken(user: TokenDto) {
    const access = this.jwtService.sign(user, {
      secret: this.configService.get<string>("SECRET_ACCESS"),
      expiresIn: "1h",
      algorithm: "HS256",
    });
    const refresh = this.jwtService.sign(user, {
      secret: this.configService.get<string>("SECRET_REFRESH"),
      expiresIn: "60d",
      algorithm: "HS256",
    });
    return { access, refresh };
  }
}

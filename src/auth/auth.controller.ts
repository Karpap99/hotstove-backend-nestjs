import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  @Post("register")
  public async register(@Body() user: SignUpDto) {
    return await this.service.register(user);
  }

  @Post("login")
  public async login(@Body() user: LoginDto) {
    return await this.service.login(user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/refresh_token")
  public getToken(@Req() req: Request) {
    return this.service.getToken(req.user);
  }

  @Post("logout")
  public logout() {
    return "";
  }

  @Get("reauth")
  public async refreshAuth(@Req() req: Request) {
    const refresh = req.headers.cookie;
    if (!refresh) throw new UnauthorizedException();
    return await this.service.refreshAuth(refresh);
  }

  @Get("verify")
  public verify() {
    return this.service.verifyToken("", "access");
  }
}

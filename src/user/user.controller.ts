import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDTO } from "./dto/user.dto";
import { AuthGuard } from "@nestjs/passport";
@Controller("user")
export class UserController {
  constructor(private serv: UserService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/get_one")
  public async getOneById(@Req() req: Request) {
    return await this.serv.getUserById(req.user?.uuid);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/getUserWithDataById")
  public async getUserById(
    @Req() req: Request,
    @Query("UserId") UserId: string,
  ) {
    return await this.serv.getUserWithDataById(req.user?.uuid, UserId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/")
  public async deleteOneById(@Req() req: Request) {
    return await this.serv.Delete(req.user?.uuid);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  public async PostOne(@Body() user: UserDTO) {
    return await this.serv.Create(user);
  }
}

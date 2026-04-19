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
import { AuthGuard } from "@nestjs/passport";
import { FollowerService } from "./follower.service";
import { Request } from "express";

@Controller("follower")
export class FollowerController {
  constructor(private serv: FollowerService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("")
  async OnFollow(@Req() req: Request, @Body("followTO") followTO: string) {
    return await this.serv.FollowOn(req.user?.uuid, followTO);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("")
  async UnFollow(@Req() req: Request, @Query("followTO") followTO: string) {
    return await this.serv.UnFollow(req.user?.uuid, followTO);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("FollowedByUser")
  async Followed(@Req() req: Request) {
    return await this.serv.FollowedByUser(req.user?.uuid);
  }
}

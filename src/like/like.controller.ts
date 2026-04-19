import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LikeService } from "./like.service";

@Controller("like")
export class LikeController {
  constructor(private service: LikeService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("")
  async setLike(@Req() req: Request, @Body("postId") postId: string) {
    return await this.service.setLike(req.user?.uuid, postId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("")
  async deleteLike(@Req() req: Request, @Query("postId") postId: string) {
    return await this.service.deleteLike(req.user?.uuid, postId);
  }
}

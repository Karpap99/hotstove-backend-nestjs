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
import { MessageLikeService } from "./message-like.service";

@Controller("message-like")
export class MessageLikeController {
  constructor(private service: MessageLikeService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("")
  async setLike(@Req() req: Request, @Body("messageId") messageId: string) {
    return await this.service.setLike(req.user?.uuid, messageId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("")
  async deleteLike(@Req() req: Request, @Query("messageId") messageId: string) {
    return await this.service.deleteLike(req.user?.uuid, messageId);
  }
}

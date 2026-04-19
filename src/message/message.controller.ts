import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { MessageService } from "./message.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("message")
export class MessageController {
  constructor(private serv: MessageService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async sendMessage(
    @Req() req: Request,
    @Body("data") data: { postId: string; text: string },
  ) {
    return await this.serv.sendMessage(req.user?.uuid, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/getAllByPost")
  public async getAllByPost(
    @Req() req: Request,
    @Query("postId") postId: string,
  ) {
    return await this.serv.getAllByPost(req.user?.uuid, postId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("")
  public async update(
    @Req() req: Request,
    @Body("data") data: { messageId: string; text: string },
  ) {
    return await this.serv.UpdateMessage(req.user?.uuid, data);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("")
  public async Delete(
    @Req() req: Request,
    @Query("messageId") messageId: string,
  ) {
    return await this.serv.Delete(req.user?.uuid, messageId);
  }
}

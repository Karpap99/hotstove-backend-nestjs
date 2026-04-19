import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateDTO } from "./dto/update.dto";
import { Request } from "express";

@Controller("profile")
export class ProfileController {
  constructor(private service: ProfileService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  public async getOne(@Req() req: Request, @Body() id: string) {
    return await this.service.getUserDataById(id ? id : req.user.uuid);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/")
  @UseInterceptors(FileInterceptor("file"))
  public async UpdateOneById(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({
            maxSize: 10000000, // 10MB
            message: "File is too large. Max file size is 10MB",
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
    @Body() update: UpdateDTO,
  ) {
    return await this.service.Update(req.user.uuid, update, file);
  }
}

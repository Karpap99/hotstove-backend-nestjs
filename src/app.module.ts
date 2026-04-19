import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { UploaderModule } from "./uploader/uploader.module";
import "reflect-metadata";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { PostModule } from "./post/post.module";
import { MailModule } from "./mail/mail.module";
import { FollowerModule } from "./follower/follower.module";
import { LikeModule } from "./like/like.module";
import { ProfileModule } from "./profile/profile.module";
import { MessageModule } from "./message/message.module";
import { TagModule } from "./tag/tag.module";
import { MessageLikeModule } from "./message-like/message-like.module";
import { configService } from "./config/config.service";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UserModule,
    UploaderModule,
    MailModule,
    FollowerModule,
    PostModule,
    MessageModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
    LikeModule,
    ProfileModule,
    TagModule,
    MessageLikeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

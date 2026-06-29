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
import { AiService } from "./ai/ai.service";
import { TestModule } from "./test/test.module";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import KeyvRedis, { Keyv } from "@keyv/redis";
import { KeyvCacheableMemory } from "node_modules/cacheable/dist/index.cjs";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    TestModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(process.env.REDIS_URL),
          ],
        };
      },
    }),
  ],
  controllers: [],
  providers: [AiService],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UploaderModule } from "src/uploader/uploader.module";
import { PostModule } from "src/post/post.module";
import { FollowerModule } from "src/follower/follower.module";
import { ProfileModule } from "src/profile/profile.module";

@Module({
  imports: [
    UploaderModule,
    PostModule,
    FollowerModule,
    ProfileModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

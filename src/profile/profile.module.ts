import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "../entity/profile.entity";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { UploaderModule } from "src/uploader/uploader.module";
import { PostModule } from "src/post/post.module";
import { FollowerModule } from "src/follower/follower.module";
import { User } from "src/entity/user.entity";

@Module({
  imports: [
    UploaderModule,
    PostModule,
    FollowerModule,
    TypeOrmModule.forFeature([Profile, User]),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}

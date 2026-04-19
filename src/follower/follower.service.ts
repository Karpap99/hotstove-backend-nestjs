import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SMALL_AVATAR } from "src/constants";
import { Follower } from "src/entity/follower.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class FollowerService {
  constructor(
    @InjectRepository(Follower) private readonly repo: Repository<Follower>,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async isFollowed(follower: string, followed: string) {
    return await this.repo.exists({
      where: { followedId: followed, followerId: follower },
    });
  }

  async FollowOn(uuid: string, followTo: string) {
    if (uuid === followTo)
      throw new BadRequestException("Cannot follow yourself");

    try {
      const result = await this.repo.insert({
        followerId: uuid,
        followedId: followTo,
      });

      await this.user.increment({ id: followTo }, "followersCount", 1);

      return result;
    } catch (err) {
      Logger.log(err);
      throw err;
    }
  }

  async UnFollow(uuid: string, followTo: string) {
    if (uuid === followTo)
      throw new BadRequestException("Cannot unfollow yourself");

    try {
      await this.repo.delete({ followedId: followTo, followerId: uuid });
      await this.user.decrement({ id: followTo }, "followersCount", 1);

      return { success: true };
    } catch (err) {
      Logger.log(err);
      throw err;
    }
  }

  async FollowedByUser(uuid: string) {
    const follows = await this.repo.find({
      where: { followerId: uuid },
      relations: ["followed", "followed.profile"],
    });
    const formated = follows.map((follow) => {
      return {
        id: follow.followed.id,
        nickname: follow.followed.nickname,
        profile_picture: SMALL_AVATAR.replace(
          "default",
          follow.followed.profile.profile_picture,
        ),
      };
    });
    return formated;
  }
}

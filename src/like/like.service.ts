import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Likes } from "src/entity/likes.entity";
import { Post } from "src/entity/post.entity";
import { User } from "src/entity/user.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Likes) private readonly repo: Repository<Likes>,
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Post) private readonly post: Repository<Post>,
  ) {}

  public async getPostLike(user: User, post: Post) {
    const result = await this.repo.findBy({ post: post, likeBy: user });
    return result;
  }

  public async getPostsLikesByIds(userId: string, ids: string[]) {
    return await this.repo.findBy({
      post: In(ids),
      likeBy: { id: userId },
    });
  }

  public async getPostLikeByIds(userId: string, postId: string) {
    return await this.repo.findOneBy({
      post: { id: postId },
      likeBy: { id: userId },
    });
  }

  public async GetLikedPosts(userId: string) {
    return await this.repo.find({
      where: { likeBy: { id: userId } },
      select: {
        postId: true,
      },
    });
  }

  public async setLike(userId: string, postId: string) {
    const user = await this.user.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException("user_error");
    const post = await this.post.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException("user_error");
    const existing_like = await this.repo.findOne({
      where: { likeBy: { id: userId }, post: { id: postId } },
    });
    if (existing_like) return;
    const new_like = new Likes();
    new_like.post = post;
    new_like.likeBy = user;
    await this.post.increment({ id: post.id }, "likeCount", 1);
    return await this.repo.save(new_like);
  }

  public async deleteLike(userId: string, postId: string) {
    const user = await this.user.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException();
    const post = await this.post.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException();
    const existing_like = await this.repo.findOne({
      where: { likeBy: { id: userId }, post: { id: postId } },
      relations: ["likeBy", "post"],
    });
    if (!existing_like) return;
    await this.post.decrement({ id: post.id }, "likeCount", 1);
    return await this.repo.delete(existing_like.id);
  }
}

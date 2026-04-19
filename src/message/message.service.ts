import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/entity/message.entity";
import { Repository } from "typeorm";
import { Post } from "src/entity/post.entity";
import { MessageLikeService } from "src/message-like/message-like.service";
import { SMALL_AVATAR } from "src/constants";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly repo: Repository<Message>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    private likeService: MessageLikeService,
  ) {}

  async sendMessage(uuid: string, data: { postId: string; text: string }) {
    const post = await this.posts.findOne({ where: { id: data.postId } });
    if (!post) throw new BadRequestException();

    const message = this.repo.create({
      post,
      user: { id: uuid },
      text: data.text,
    });
    const saved = await this.repo.save(message);
    await this.posts.increment({ id: post.id }, "messagesCount", 1);
    const newMsg = await this.repo.findOne({
      where: { id: saved.id },
      relations: ["user", "user.user_data"],
    });
    if (!newMsg) return saved;
    return {
      ...newMsg,
      user: {
        id: newMsg.user.id,
        nickname: newMsg.user.nickname,
        profile_picture: SMALL_AVATAR.replace(
          "default",
          newMsg.user.profile.profile_picture,
        ),
      },
      isLiked: false,
    };
  }
  async getAllByPost(uuid: string, postId: string) {
    const post = await this.posts.exists({ where: { id: postId } });
    if (!post) throw new BadRequestException();
    const messages = await this.repo.find({
      where: { post: { id: postId } },
      relations: ["user", "user.user_data"],
    });

    const messageIds = messages.map((msg) => msg.id);
    const userLikes = await this.likeService.findLikesForMessages(
      uuid,
      messageIds,
    );
    const likedMessageIds = new Set(userLikes.map((like) => like.message.id));

    const formated = messages.map((message) => {
      return {
        ...message,
        user: {
          id: message.user.id,
          nickname: message.user.nickname,
          profile_picture: SMALL_AVATAR.replace(
            "default",
            message.user.profile.profile_picture,
          ),
        },
        isLiked: likedMessageIds.has(message.id),
      };
    });
    return formated;
  }

  async UpdateMessage(uuid: string, data: { messageId: string; text: string }) {
    const message = await this.repo.exists({
      where: { id: data.messageId, user: { id: uuid } },
    });
    if (!message) throw new BadRequestException("");
    return await this.repo.update(
      { user: { id: uuid }, id: data.messageId },
      { text: data.text },
    );
  }

  async Delete(uuid: string, messageId: string) {
    const message = await this.repo.findOne({
      where: { id: messageId, user: { id: uuid } },
      relations: ["post"],
    });
    if (!message) throw new BadRequestException();
    await this.repo.delete({ id: messageId });
    await this.posts.decrement({ id: message.post.id }, "messagesCount", 1);
    return { success: true };
  }
}

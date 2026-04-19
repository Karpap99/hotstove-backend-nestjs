import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostTag } from "src/entity/postTag.entity";
import { Tag } from "src/entity/tag.entity";
import { Repository, In } from "typeorm";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(PostTag) private readonly repo: Repository<PostTag>,
    @InjectRepository(Tag) private readonly Tags: Repository<Tag>,
  ) {}

  async addTags(postId: string, tags: string) {
    const Tags = JSON.parse(tags) as { id: string }[];
    const ids = Tags.map((t) => t.id);
    const existingTags = await this.repo.findBy({ id: In(ids) });
    const payloads = existingTags.map((tag) => ({
      postId: postId,
      tagId: tag.id,
    }));
    await this.repo.save(payloads);
    return;
  }
}

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/entity/post.entity";
import { ILike, In, Repository } from "typeorm";
import { CreateDTO } from "./dto/create.dto";
import { LikeService } from "src/like/like.service";
import { UploaderService } from "src/uploader/uploader.service";
import { element } from "./dto/types";
import { Marking } from "src/entity/marking.entity";
import { TagsService } from "src/tags/tags.service";
import { FollowerService } from "src/follower/follower.service";
import { SMALL_AVATAR } from "src/constants";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Likes } from "src/entity/likes.entity";
import { Message } from "src/entity/message.entity";

@Injectable()
export class PostService {
  UpdatePost() {
    throw new Error("Method not implemented.");
  }
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    @InjectRepository(Marking) private readonly mark: Repository<Marking>,
    @Inject(forwardRef(() => LikeService)) private like: LikeService,
    @Inject(forwardRef(() => UploaderService)) private upld: UploaderService,
    @Inject(forwardRef(() => TagsService)) private tagsSrvc: TagsService,
    @Inject(forwardRef(() => FollowerService))
    private follower: FollowerService,
  ) {}

  POST_BASE_RELATIONS = ["creator", "creator.profile", "tags", "tags.tag"];

  Formater(publication: Post, isLiked: boolean) {
    return {
      ...publication,
      creator: {
        id: publication.creator.id,
        nickname: publication.creator.nickname,
        profile_picture: SMALL_AVATAR().replace(
          "default",
          publication.creator.profile.profile_picture,
        ),
      },
      liked: isLiked,
      tags: publication.tags.map((tag) => {
        return {
          id: tag.tag.id,
          content: tag.tag.content,
        };
      }),
    };
  }

  async FormatPublication(publication: Post, uuid: string) {
    const likes = await this.like.getPostsLikesByIds(uuid, [publication.id]);

    const likedSet = new Set(likes.map((l) => l.post.id));

    const formated = this.Formater(publication, likedSet.has(publication.id));

    return formated;
  }

  async FormatPublications(publications: Post[], uuid: string) {
    const Ids = publications.map((p) => p.id);

    const likes = await this.like.getPostsLikesByIds(uuid, Ids);

    const likedSet = new Set(likes.map((l) => l.post.id));

    const formated = publications.map((publication) => {
      return this.Formater(publication, likedSet.has(publication.id));
    });
    return formated;
  }

  async getLikedPosts(uuid: string) {
    const liked = await this.like.GetLikedPosts(uuid);

    if (liked.length === 0) return { data: [] };

    const publications = await this.repo.find({
      where: { id: In([...liked.map((l) => l.postId)]) },
      relations: this.POST_BASE_RELATIONS,
    });

    const formatedPublications = publications.map((publication) => {
      return this.Formater(publication, true);
    });
    return { data: formatedPublications };
  }

  public async getPostsById(userId: string, postId: string) {
    const publication = await this.repo.findOne({
      where: { id: postId },
      relations: this.POST_BASE_RELATIONS,
    });
    if (!publication) throw new NotFoundException();
    return await this.FormatPublication(publication, userId);
  }

  public async getPostsByIdWithMarking(userId: string, postId: string) {
    const publication = await this.repo.findOne({
      where: { id: postId },
      relations: [...this.POST_BASE_RELATIONS, "marking"],
    });
    if (!publication) throw new NotFoundException();
    return await this.FormatPublication(publication, userId);
  }

  async ByUserAndFollowed(uuid: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const followed = await this.follower.FollowedByUser(uuid);
    const followedIds = followed.map((f) => f.id);
    const [publications, total] = await this.repo.findAndCount({
      where: { creatorId: In(followedIds) },
      relations: this.POST_BASE_RELATIONS,
      skip,
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });

    const formated = await this.FormatPublications(publications, uuid);
    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getPostsByUserId(
    uuid: any,
    userId: string,
    page: number,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [publications, total] = await this.repo.findAndCount({
      where: { creatorId: userId },
      relations: this.POST_BASE_RELATIONS,
      skip,
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });

    const formated = await this.FormatPublications(publications, uuid);

    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getAll(
    uuid: string,
    page: number = 1,
    limit: number = 10,
    query: string,
  ) {
    const cache_key_user = `user:${uuid}:posts:${page}:${query}`;

    const cached_for_user = await this.cache.get<{
      formated: {
        creator: {
          id: string;
          nickname: string;
          profile_picture: string;
        };
        liked: boolean;
        tags: {
          id: string;
          content: string;
        }[];
        title: string;
        description: string;
        title_picture: string;
        creatorId: string;
        views: number;
        likeCount: number;
        messagesCount: number;
        likes: Likes[];
        messages: Message[];
        marking: Marking;
        id: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
      total: number;
    }>(cache_key_user);

    if (cached_for_user && cached_for_user.formated.length > 0) {
      return {
        data: cached_for_user.formated,
        page,
        limit,
        total: cached_for_user.total,
        totalPages: Math.ceil(cached_for_user.total / limit),
      };
    }

    const cache_key = `posts:${page}:${query}`;

    let cached = await this.cache.get<{ publications: Post[]; total: number }>(
      cache_key,
    );

    if (!cached || cached.publications.length === 0) {
      const skip = (page - 1) * limit;

      const [publications, total] = await this.repo.findAndCount({
        where: { title: ILike(`%${query}%`) },
        relations: this.POST_BASE_RELATIONS,
        skip,
        take: limit,
        order: {
          createdAt: "DESC",
        },
      });

      await this.cache.set(cache_key, { publications, total }, 60_000);

      cached = { publications, total };
    }

    const formated = await this.FormatPublications(cached.publications, uuid);

    await this.cache.set(
      cache_key_user,
      { formated, total: cached.total },
      30_000,
    );

    return {
      data: formated,
      page,
      limit,
      total: cached.total,
      totalPages: Math.ceil(cached.total / limit),
    };
  }

  public async getTitles(
    page: number = 1,
    limit: number = 10,
    query: string = "",
  ) {
    const [publications, total] = await this.repo.findAndCount({
      where: { title: ILike(`%${query}%`) },
      take: limit,
    });

    const formated = publications.map((publication) => {
      return {
        title: publication.title,
      };
    });

    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async Test(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [publications, total] = await this.repo.findAndCount({
      relations: this.POST_BASE_RELATIONS,
      skip,
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });

    const formated = await this.FormatPublications(publications, "");

    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async UpdateView(postId: string) {
    return await this.repo.increment({ id: postId }, "views", 1);
  }

  public async UpdateLike(postId: string) {
    return await this.repo.increment({ id: postId }, "likes", 1);
  }

  public async CreatePost(
    userId: string,
    dto: CreateDTO,
    files: Express.Multer.File[],
    tags: string,
  ) {
    let marking: element;
    try {
      marking = JSON.parse(dto.marking) as element;
    } catch (e) {
      Logger.log(e);
      throw new BadRequestException("Invalid marking JSON");
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const resp = await this.upld.uploadPostFile(file);
        return { file, url: resp.url };
      }),
    );

    const titlePic = uploadResults.find(
      (res) => res.file.originalname === "title_picture",
    );
    if (titlePic) {
      dto.title_picture = titlePic.url;
    }
    for (const { file, url } of uploadResults) {
      if (file.originalname !== "title_picture") {
        marking.children = this.SearchAndAsignImage(marking.children, {
          name: file.originalname,
          uri: url,
        });
      }
    }

    const publication = await this.repo.save({
      ...CreateDTO.WithoutMarking(dto),
      creatorId: userId,
    });

    const mrk = await this.mark.save({
      postId: publication.id,
      marking,
    });

    if (tags && tags.trim()) {
      this.tagsSrvc.addTags(publication.id, tags);
    }

    return { publication, mrk };
  }

  public async Delete(uuid: string, postId: string) {
    const result = await this.repo.delete({
      id: postId,
      creator: { id: uuid },
    });
    if (result.affected === 0)
      return {
        status: "No publication from user found",
      };
    return { status: "success" };
  }

  SearchAndAsignImage(
    marking: element[],
    file: { name: string; uri: string },
  ): element[] {
    const deepCopy = structuredClone(marking);
    const assign = (elements: element[]) => {
      return elements.map((el) => {
        const newEl = { ...el };
        if (
          (newEl.component === "Image" || newEl.component === "Video") &&
          newEl.value === file.name
        ) {
          newEl.value = file.uri;
        }
        if (newEl.children && Array.isArray(newEl.children)) {
          newEl.children = assign(newEl.children);
        }
        return newEl;
      });
    };
    return assign(deepCopy);
  }
}

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { FollowerService } from "src/follower/follower.service";
import { BIG_AVATAR } from "src/constants";
import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @Inject(forwardRef(() => FollowerService))
    private follower: FollowerService,
  ) {}

  public async getAll() {
    return await this.repo.find();
  }

  public async existById(uuid: string): Promise<boolean> {
    return await this.repo.exists({ where: { id: uuid } });
  }

  public async existByEmail(email: string): Promise<boolean> {
    return await this.repo.exists({ where: { email: email } });
  }

  public async getUserByEmail(email: string) {
    return await this.repo.findOneBy({ email: email });
  }

  public async getUserById(id: string) {
    const result = await this.repo.findOneBy({
      id: id,
    });
    if (!result) throw new BadRequestException("No user");
    return result;
  }

  public async getUserWithPostsAndSubscribe(requestedUser: string) {
    const user = await this.repo.findOne({ where: { id: requestedUser } });
    if (!user) {
      throw new BadRequestException(
        `User with id ${requestedUser} doen't exist`,
      );
    }
    user.profile.profile_picture = BIG_AVATAR().replace(
      "default",
      user.profile.profile_picture,
    );
    return user;
  }

  public async getUserWithDataById(caller: string, uuid: string) {
    const Caller = await this.repo.exists({ where: { id: caller } });
    if (!Caller) throw BadRequestException;
    const user = await this.repo.findOne({
      where: { id: uuid },
      relations: ["profile"],
    });
    if (!user) throw BadRequestException;

    const followed = await this.follower.isFollowed(caller, uuid);
    const response = {
      ...user,
      ...user.profile,
      profile_picture: BIG_AVATAR().replace(
        "default",
        user.profile.profile_picture,
      ),
      followed: followed,
    };
    return response;
  }

  public async Create(createUserDto: CreateUserDto) {
    return await this.repo.save(createUserDto);
  }

  public async Delete(id: string) {
    return await this.repo.delete(id);
  }
}

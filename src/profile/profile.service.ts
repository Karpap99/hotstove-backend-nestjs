import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { UploaderService } from "src/uploader/uploader.service";
import { Profile } from "../entity/profile.entity";
import { UpdateDTO } from "./dto/update.dto";
import { BIG_AVATAR } from "src/constants";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private readonly profiles: Repository<Profile>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @Inject(forwardRef(() => UploaderService))
    private uploader: UploaderService,
  ) {}

  async getUserDataById(uuid: string) {
    const profile = await this.profiles.findOne({
      where: { userId: uuid },
    });
    if (!profile) throw new BadRequestException("No user");
    profile.profile_picture = BIG_AVATAR.replace(
      "default",
      profile.profile_picture,
    );
    return { result: profile };
  }

  public async Update(
    uuid: string,
    update: UpdateDTO,
    file?: Express.Multer.File,
  ) {
    const u = await this.users.findOne({ where: { id: uuid } });
    if (!u) return { result: "user doesn't exist" };

    let profile = await this.profiles.findOne({
      where: { userId: u.id },
      relations: ["user"],
    });

    if (!profile) {
      profile = new Profile();
      profile.user = u;
    }

    if (file) {
      const pfp = await this.uploader.uploadProfilePhoto({
        file,
        isPublic: true,
      });
      profile.profile_picture = pfp.url;
    }

    if (update.age) {
      profile.age = new Date(update.age);
    }
    profile.description = update.description;

    const result = await this.profiles.save(profile);
    result.profile_picture = BIG_AVATAR.replace(
      "default",
      result.profile_picture,
    );
    return { res: "updated", result };
  }
}

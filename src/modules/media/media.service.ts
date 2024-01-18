import { Inject, Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { MEDIA_REPO } from "common/constants/repos";
import { Media } from "./entity/media.entity";
import { Repository } from "typeorm";
import { User } from "modules/user/entities/user.entity";

@Injectable()
export class MediaService extends TypeOrmCrudService<Media> {
  constructor(@Inject(MEDIA_REPO) repo: Repository<Media>) {
    super(repo);
  }

  async create(user: User, media: Partial<Media>): Promise<Media> {
    const data: Partial<Media> = {
      ...media,
      author: user,
    };

    return this.repo.save(data);
  }
}

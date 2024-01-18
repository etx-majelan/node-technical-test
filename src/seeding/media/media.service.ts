import { Inject, Injectable } from "@nestjs/common";
import { Repository, DeepPartial } from "typeorm";
import { Media } from "modules/media/entity/media.entity";
import { getMediaData } from "./media.data";
import { MEDIA_REPO } from "common/constants/repos";
import { User } from "modules/user/entities/user.entity";

@Injectable()
export class MediaSeederService {
  constructor(
    @Inject(MEDIA_REPO)
    private readonly _repo: Repository<Media>
  ) {}

  async create(author: User): Promise<Media[]> {
    const entities = getMediaData().map((obj: DeepPartial<Media>) =>
      this._repo.create({ author, ...obj })
    );

    return this._repo.save(entities);
  }
  async findMedia(): Promise<Media[]> {
    return this._repo.find();
  }
}

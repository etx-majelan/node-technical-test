import { Injectable } from "@nestjs/common";
import { UserSeederService } from "./user/user.service";
import { MediaSeederService } from "./media/media.service";
import { User } from "modules/user/entities/user.entity";

@Injectable()
export default class SeederService {
  constructor(
    private readonly _userSeederService: UserSeederService,
    private readonly _mediaSeederService: MediaSeederService
  ) {}
  async seed_all(): Promise<void> {
    const user = await this.seed_alpha_user();
    await this.seed_media(user);
  }

  async seed_alpha_user(): Promise<User> {
    const existing_user = await this._userSeederService.findUserAlpha();
    if (!existing_user) {
      const user = await this._userSeederService.createUser();
      console.log("alpha users seeded");
      return user;
    }
    return existing_user;
  }

  async seed_media(authour: User): Promise<void> {
    const media = await this._mediaSeederService.findMedia();
    if (media.length < 1) {
      await this._mediaSeederService.create(authour);
      console.log("media seeded");
    }
  }
}

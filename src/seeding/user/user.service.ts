import { Inject, Injectable } from "@nestjs/common";
import { User } from "modules/user/entities/user.entity";
import { getData } from "./user.data";
import { USER_REPO } from "common/constants/repos";

@Injectable()
export class UserSeederService {
  constructor(
    @Inject(USER_REPO)
    private readonly _userRepository
  ) {}

  async createUser(): Promise<User> {
    const userEntity = this._userRepository.create(getData());

    return this._userRepository.save(userEntity);
  }
  async findUserAlpha(): Promise<User | null> {
    return this._userRepository.findOne({
      where: { email: process.env.USER_ALPHA },
    });
  }
}

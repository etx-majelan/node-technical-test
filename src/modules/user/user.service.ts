import { Inject, Injectable } from "@nestjs/common";
import { USER_REPO } from "common/constants/repos";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@Inject(USER_REPO) repo) {
    super(repo);
  }
}

import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { Crud, CrudController } from "@rewiko/crud";

@Crud({
  model: {
    type: User,
  },
  query: {
    join: {
      mediaPosted: {
        eager: true,
      },
      programsCurated: { eager: true },
    },
    exclude: ["password"],
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
  },
})
@Controller("user")
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}
}

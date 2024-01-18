import { Controller, UseGuards } from "@nestjs/common";
import { MediaService } from "./media.service";
import { Media } from "./entity/media.entity";
import { Crud, CrudController, Override, ParsedBody } from "@rewiko/crud";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { User } from "modules/user/entities/user.entity";
import { AuthUser } from "decorators/auth-user.decorator";

@Crud({
  model: {
    type: Media,
  },
  query: {
    join: {
      author: {
        eager: true,
      },
      program: {
        eager: true,
      },
    },
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
  },
})
@UseGuards(JwtAuthGuard)
@Controller("media")
export class MediaController implements CrudController<Media> {
  constructor(public service: MediaService) {}
  @Override()
  createOne(
    @AuthUser() user: User,
    @ParsedBody() dto: Partial<Media>
  ): Promise<Media> {
    return this.service.create(user, dto);
  }
}

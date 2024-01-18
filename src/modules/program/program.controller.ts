import { Controller, UseGuards } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { Program } from "./entity/program.entity";
import { Crud, CrudController, Override, ParsedBody } from "@rewiko/crud";
import { AuthUser } from "decorators/auth-user.decorator";
import { User } from "modules/user/entities/user.entity";
import { JwtAuthGuard } from "guards/jwt-auth.guard";

@Crud({
  model: {
    type: Program,
  },
  query: {
    join: {
      media: {
        eager: true,
      },
      curator: {
        eager: true,
      },
    },
  },
  routes: {
    exclude: ["createManyBase", "replaceOneBase"],
  },
})
@UseGuards(JwtAuthGuard)
@Controller("program")
export class ProgramController implements CrudController<Program> {
  constructor(public service: ProgramService) {}

  @Override()
  createOne(
    @AuthUser() user: User,
    @ParsedBody() dto: Partial<Program>
  ): Promise<Program> {
    return this.service.create(user, dto);
  }
}

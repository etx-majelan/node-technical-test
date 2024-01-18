import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { Program } from "./entity/program.entity";
import { PROGRAM_REPO } from "common/constants/repos";
import { TypeOrmCrudService } from "@rewiko/crud-typeorm";
import { Repository } from "typeorm";
import { User } from "modules/user/entities/user.entity";
import { JwtAuthGuard } from "guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Injectable()
export class ProgramService extends TypeOrmCrudService<Program> {
  constructor(@Inject(PROGRAM_REPO) repo: Repository<Program>) {
    super(repo);
  }
  async create(user: User, program: Partial<Program>): Promise<Program> {
    const data: Partial<Program> = {
      curator: user,
      ...program,
    };

    return this.repo.save(this.repo.create(data));
  }
}

import { Module } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { ProgramController } from "./program.controller";
import { DATA_SOURCE, PROGRAM_REPO } from "common/constants/repos";
import { SharedModule } from "modules/shared/shared.module";
import { DataSource } from "typeorm";
import { Program } from "./entity/program.entity";

@Module({
  imports: [SharedModule],
  controllers: [ProgramController],
  providers: [
    {
      provide: PROGRAM_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Program),
      inject: [DATA_SOURCE],
    },
    ProgramService,
  ],
  exports: [ProgramService],
})
export class ProgramModule {}

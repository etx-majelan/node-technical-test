import { Module } from "@nestjs/common";
import { User } from "modules/user/entities/user.entity";
import { UserSeederService } from "./user.service";
import { SharedModule } from "modules/shared/shared.module";
import { USER_REPO, DATA_SOURCE } from "common/constants/repos";
import { DataSource } from "typeorm";

@Module({
  imports: [SharedModule],
  providers: [
    {
      provide: USER_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: [DATA_SOURCE],
    },
    UserSeederService,
  ],
  exports: [UserSeederService],
})
export class UserSeederModule {}

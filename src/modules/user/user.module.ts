import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DATA_SOURCE, USER_REPO } from "common/constants/repos";
import { SharedModule } from "modules/shared/shared.module";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";

@Module({
  imports: [SharedModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: [DATA_SOURCE],
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}

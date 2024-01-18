import { Module } from "@nestjs/common";
import SeederService from "./seeder.service";
import { UserSeederModule } from "./user/user.module";
import { SharedModule } from "modules/shared/shared.module";
import { MediaSeederModule } from "./media/media.module";

@Module({
  imports: [SharedModule, UserSeederModule, MediaSeederModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}

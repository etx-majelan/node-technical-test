import { Module } from "@nestjs/common";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { SharedModule } from "modules/shared/shared.module";
import { MEDIA_REPO, DATA_SOURCE } from "common/constants/repos";
import { DataSource } from "typeorm";
import { Media } from "./entity/media.entity";

@Module({
  imports: [SharedModule],
  controllers: [MediaController],
  providers: [
    {
      provide: MEDIA_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Media),
      inject: [DATA_SOURCE],
    },
    MediaService,
  ],
  exports: [MediaService],
})
export class MediaModule {}

import { SharedModule } from "modules/shared/shared.module";
import { MediaSeederService } from "./media.service";
import { DATA_SOURCE, MEDIA_REPO } from "common/constants/repos";
import { Media } from "modules/media/entity/media.entity";
import { Module } from "@nestjs/common";
import { DataSource } from "typeorm";

@Module({
  imports: [SharedModule],
  providers: [
    {
      provide: MEDIA_REPO,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Media),
      inject: [DATA_SOURCE],
    },
    MediaSeederService,
  ],
  exports: [MediaSeederService],
})
export class MediaSeederModule {}

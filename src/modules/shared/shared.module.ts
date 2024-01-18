import { Module } from "@nestjs/common";
import { mySqlCofig } from "./config.service";

@Module({
  providers: [...mySqlCofig()],
  exports: [...mySqlCofig()],
})
export class SharedModule {}

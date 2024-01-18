import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import SeederService from "seeding/seeder.service";

@Injectable()
export class AppService implements OnModuleInit {
  private readonly _configService = new ConfigService();
  private readonly _moduleOptions = { strict: false };

  private _seederService: SeederService;

  constructor(private readonly _moduleRef: ModuleRef) {}

  public async onModuleInit(): Promise<void> {
    this._seederService = this._moduleRef.get(
      SeederService,
      this._moduleOptions
    );
    await this._initSeed();
  }

  private async _initSeed(): Promise<void> {
    const apiSeed: boolean =
      this._configService.get("SEED_DATA_TEST") === "true";

    if (apiSeed) await this._seederService.seed_all();
  }
}

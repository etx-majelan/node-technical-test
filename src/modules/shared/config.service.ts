import { isNil } from "lodash";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + " environment variable is not set");
    }

    return value;
  }
  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, "\n");
  }
  public getPort() {
    return this.getNumber("PORT");
  }

  public isProduction() {
    const mode = this.getString("MODE");
    return mode != "dev";
  }

  get jwtConfig(): {
    jwtSecret: string;
    jwtExpirationTime: string;
  } {
    return {
      jwtSecret: this.getString("JWT_SECRET_KEY"),
      jwtExpirationTime: this.getString("JWT_EXPIRATION_TIME"),
    };
  }
}

export const mySqlCofig = () => {
  return [
    {
      provide: "DATA_SOURCE",
      useFactory: async () => {
        const dataSource = new DataSource({
          type: "mysql",
          host: process.env.MYSQL_HOST,
          port: parseInt(process.env.MYSQL_PORT as string),
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          entities: [__dirname + "/../**/*.entity{.ts,.js}"],
          synchronize: true,
          //logging: true,
        });

        return dataSource.initialize();
      },
    },
  ];
};

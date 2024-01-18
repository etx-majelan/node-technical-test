import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "helmet";
import * as dot from "dotenv";
import { TypeOrmExceptionFilter } from "helpers/exceptionHandler";
import { CrudConfigService } from "@rewiko/crud";
// Important: load config before (!!!) you import AppModule
CrudConfigService.load({
  query: {
    cache: 2000,
    maxLimit: 20,
    alwaysPaginate: true,
  },
  params: {
    id: {
      field: "id",
      type: "uuid",
      primary: true,
    },
  },
});
import { AppModule } from "modules/app/app.module";

dot.config();

async function start() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === "production"
          ? helmet.contentSecurityPolicy.getDefaultDirectives()
          : false,
    })
  );
  app.useGlobalFilters(new TypeOrmExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  return app;
}
start();

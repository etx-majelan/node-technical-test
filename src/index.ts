import "reflect-metadata";
import Fastify from "fastify";
import { bootstrap } from "fastify-decorators";
import path, { resolve } from "path";
import AutoLoad from "@fastify/autoload";

const fastify = Fastify({
  logger: true
});

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  matchFilter: /.*\.plugin\.[tj]s$/,
});

fastify.register(bootstrap, { 
  directory: resolve(__dirname, `application/controllers`),
  mask: /\.controller\./,
});

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
    await fastify.ready();
    fastify.swagger();
  } catch (error) {
    console.error(error);
    fastify.log.error(error);
  }
}

start();
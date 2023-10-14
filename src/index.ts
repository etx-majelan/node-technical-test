import Fastify from "fastify";
import mediaRoutes from './medias/routes';

const fastify = Fastify({
  logger: true
});

fastify.register(mediaRoutes, { prefix: '/medias' });

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (error) {
    console.error(error);
    fastify.log.error(error);
  }
}

start();

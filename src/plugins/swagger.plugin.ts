import fp from 'fastify-plugin'
import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import { MediaSchema } from '@application/schemas/media.schema';
import { ProgramSchema } from '@application/schemas/program.schema';


export default fp<FastifyDynamicSwaggerOptions>(async (fastify, opts) => {
  fastify.register(require('@fastify/swagger'), {
    mode: 'dynamic',
    swagger: {
      info: {
        title: 'majelan-node API',
        description:
          'A typescript REST API using Fastify, TypeORM, and Dependency Injection',
        version: '1.0.0'
      },
      host: '127.0.0.1:8080',
        basePath: '',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [{
            name: 'Media',
            description: 'Media\'s API'
        }, {
            name: 'Program',
            description: 'Program\'s API'
        }],
        definitions: {
            Media: MediaSchema,
            Program: ProgramSchema
        }
    }
  })
  fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list', // expand/not all the documentations none|list|full
        deepLinking: true
    },
    staticCSP: false,
    // transformStaticCSP: (header) => header,
    exposeRoute: true
  });
})
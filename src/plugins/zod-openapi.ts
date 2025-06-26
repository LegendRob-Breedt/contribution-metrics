import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import {
  fastifyZodOpenApiTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi';

async function zodPlugin(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Contribution Metrics API',
        description: 'API for tracking GitHub contribution metrics',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
    transform: fastifyZodOpenApiTransform,
  });

  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
  });

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
}

export default fp(zodPlugin, {
  name: 'zod-openapi',
});

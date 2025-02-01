import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { utilsRoutes } from './utils.routes';

export async function routes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.register(utilsRoutes, { prefix: '/utils' });
}
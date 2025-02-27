import type { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { Fibonacci } from '../utils/fibonacci';
import { isMainThread, Worker } from "node:worker_threads";
import { join } from "node:path";
import { chunkify } from "../utils/sum";
import { informTaskComplete } from '../notification/tasks/inform-task-completed.producer';


export async function utilsRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {

  /**
   * @description This route calculates the fibonacci value of a given number
   * @param {number} value - The number to calculate the fibonacci value
  */
  fastify.get('/fib/:value', async (request: FastifyRequest<{ Params: IFibRequest }>, reply: FastifyReply) => {
    const value = parseInt(request.params.value);
    const fib = Fibonacci.calculateFibonacciValue(value);
    informTaskComplete(`Fibonacci value of ${value} is ${fib}`);
    return reply.status(200).send({ value: fib });
  });


  /**
   * @description This route calculates the sum of a given number in a parallel way
   * @param {number} value - The number to calculate the sum
  */
  fastify.get('/sum/:value', async (request: FastifyRequest<{ Params: ISumRequest }>, reply: FastifyReply) => {
    const value = parseInt(request.params.value);
    if (isMainThread) {
      try {
        const chunks = chunkify(value);
        const workerPromises: Promise<number>[] = chunks.map(chunk => {
          return new Promise<number>((resolve, reject) => {
            const worker = new Worker(join(__dirname, "../workers/w.ts"));
            worker.on("message", (result) => {
              resolve(result);
            });
            worker.on("error", (error) => {
              reject(error);
            });
            worker.postMessage(chunk);
          })
        });
        const result = await Promise.all(workerPromises);
        informTaskComplete(`Sum of ${value} is ${result.reduce((acc, val) => acc + val)}`);
        return reply.send({ value: result.reduce((acc, val) => acc + val) });
      } catch (err) {
        return reply.send({ value: 0 });
      }

    } else {
      reply.send({ value: 0 });
    }
  });
}

interface IFibRequest {
  value: string;
}

interface ISumRequest {
  value: string;
}
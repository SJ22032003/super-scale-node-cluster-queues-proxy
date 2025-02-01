import fastify, { type FastifyInstance, type FastifyRequest, type FastifyReply } from "fastify";
import { Fibonacci } from "./fibonacci";
import type { Cluster } from "node:cluster";
import { isMainThread, Worker } from "node:worker_threads";
import { join } from "node:path";
import { cpus } from "node:os";
import { chunkify } from "../utils/sum";
import { informTaskComplete } from "../notification/tasks/inform-task-completed.producer";

export class Server {
	server: FastifyInstance;
	cluster: Cluster;
	totalCpus: number = cpus().length;

	constructor(cluster: Cluster) {
		this.cluster = cluster;
		this.server = fastify({
			logger: false,
			connectionTimeout: 20,
		});
		this.setUpRoutes();
	}


	private setUpRoutes() {
		const calledOnThisWorkerId = this.cluster.worker?.id; 
		this.server.get('/:value', function(req: FastifyRequest<{ Params: IRequest }>, _: FastifyReply) {
			const value = parseInt(req.params.value);
			const answer = Fibonacci.calculateFibonacciValue(value);
			console.log("CALLED ON THIS WORKER", calledOnThisWorkerId);
			informTaskComplete("TASK COMPLETED TO CALCULATE FIBONACCI");
			return { value: answer }; 
		});


		this.server.get('/sum/:value', async function(req: FastifyRequest<{ Params: IRequest }>, reply: FastifyReply) {
			const value = parseInt(req.params.value);
			if(isMainThread) {
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
					informTaskComplete("TASK COMPLETED");
					reply.send({ value: result.reduce((acc, val) => acc + val) });
				} catch (err) {
					reply.send({ value: 0 });
				}
				
			} else {
				reply.send({ value: 0 });
			}
		});

	}

	public start(port: number = 3001) {
		const calledOnThisWorkerId = this.cluster.worker?.id;
		this.server.listen({ port }, (err, address) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			console.log(`Server listening on ${address} on WORKER ID`, calledOnThisWorkerId);
		});
	}
}

interface IRequest {
	value: string;
}
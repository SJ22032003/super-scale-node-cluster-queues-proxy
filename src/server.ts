import fastify, { type FastifyInstance, type FastifyRequest, type FastifyReply } from "fastify";
import { Fibonacci } from "./utils/fibonacci";
import type { Cluster } from "node:cluster";
import { isMainThread, Worker } from "node:worker_threads";
import { join } from "node:path";
import { cpus } from "node:os";
import { chunkify } from "./utils/sum";
import { informTaskComplete } from "./notification/tasks/inform-task-completed.producer";
import { routes } from "./routes";

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

		this.registerRoutes();
	}

	private registerRoutes() {
		this.server.register(routes, { prefix: 'api/v1' })
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
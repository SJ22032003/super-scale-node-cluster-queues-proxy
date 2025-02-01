import fastify, { type FastifyInstance } from "fastify";
import type { Cluster } from "node:cluster";
import { cpus } from "node:os";
import { routes } from "./routes";

export class Server {
	server: FastifyInstance;
	cluster: Cluster;
	totalCpus: number = cpus().length;

	constructor(cluster: Cluster) {
		this.cluster = cluster;
		this.server = fastify({ logger: false, connectionTimeout: 20 });
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

import cluster from "node:cluster";
import { cpus } from "node:os";
import { Server } from "./server";
import "../queue/qWorkers/index";

export class Clustring {
	private readonly cluster = cluster;
	private totalCpus: number = 0;

	constructor() {
		this.totalCpus = cpus().length;
		if (this.cluster.isPrimary) {
			this.forkProcess();
		} else {
			this.runClusteredServer();
		}
	}

	private forkProcess() {
		for (let i = 0; i < this.totalCpus; i++) {
			this.cluster.fork();
		}

		this.cluster.on("exit", worker => {
			console.log("Worker exit of ID", worker.id);
			this.cluster.fork(); // RESTART IF WORKER DIES UNEXPECTEDLY
		});
	}

	runClusteredServer() {
		const server = new Server(this.cluster);
		server.start();
	}
}

new Clustring();
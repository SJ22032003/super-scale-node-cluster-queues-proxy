import { Queue } from "bullmq";

const redisConnection = {
	connection: {
		host: "localhost",
		port: 6379,
	}
}

export class QProducer {
	private q: Queue;
	constructor(name: string) {
		this.q = new Queue(name, redisConnection);
	}
	get queue() {
		return this.q;
	}
}


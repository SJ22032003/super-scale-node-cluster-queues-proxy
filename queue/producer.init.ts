import { Queue, type JobsOptions } from "bullmq";
import { qManagerForAdminUI } from "./ui/admin-server";

const redisConnection = {
	connection: {
		host: "localhost",
		port: 6379,
	}
};

export class QProducer {
	private q: Queue;
	private defaultJobOptions: JobsOptions = {
		attempts: 3, // Retry failed jobs up to 3 times
		backoff: { type: "exponential", delay: 500 }, // Exponential delay for retries
		removeOnComplete: { age: 3600, count: 1000 }, // Keep only last 1000 jobs (1-hour lifespan)
		removeOnFail: { age: 7200, count: 500 }, // Keep only last 500 failed jobs (2-hour lifespan)
	}

	constructor(name: string, defaultJobOptions?: JobsOptions) {
		this.q = new Queue(name, {
			...redisConnection,
			defaultJobOptions: {
				...this.defaultJobOptions,
				...defaultJobOptions,
			},
		});
		if(qManagerForAdminUI?.addQueue) qManagerForAdminUI.addQueue(this.q)
	}

	// Add a job to the queue with optional priority, delay, and rate limiting
	async addJob(name: string, data: any, options: Partial<JobsOptions> = {}) {
		return this.q.add(name, data, {
			priority: options.priority ?? 5, // Default priority
			delay: options.delay ?? 0, // Default: no delay
			...options,
		});
	}

	// Clean old jobs (optional: call periodically)
	async cleanOldJobs() {
		await this.q.clean(1000, 3600000, "completed"); // Remove old completed jobs (1 hour)
		await this.q.clean(500, 7200000, "failed"); // Remove old failed jobs (2 hours)
	}

	// Gracefully close the queue connection
	async closeQueue() {
		await this.q.close();
	}

	get queue() {
		return this.q;
	}
}

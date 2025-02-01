import { Job, Worker, type WorkerOptions } from "bullmq";

const redisConnection = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

export class QWorker {
  private qName: string;
  private processJobFn: (job: Job) => Promise<void>;
  private concurrency: number;
  private worker: Worker | null = null;

  constructor(
    name: string,
    processJobFn: (job: Job) => Promise<void>,
    concurrency: number = 5 // Default concurrency
  ) {
    this.qName = name;
    this.processJobFn = processJobFn;
    this.concurrency = concurrency;
  }

  async start() {
    this.worker = new Worker(
      this.qName,
      async (job: Job) => {
        try {
          console.log(`Processing job: ${job.id}, Name: ${job.name}`);
          await this.processJobFn(job);
          console.log(`Completed job: ${job.id}`);
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          throw error; // Will be retried based on retry policy
        }
      },
      {
        ...redisConnection,
        concurrency: this.concurrency,
      } as WorkerOptions
    );

    // Event Listeners
    this.worker.on("completed", (job) => {
      console.log(`✅ Job ${job.id} completed successfully.`);
    });

    this.worker.on("failed", (job, err) => {
      console.error(`❌ Job ${job?.id} failed with error:`, err);
    });

    this.worker.on("error", (err) => {
      console.error("Worker encountered an error:", err);
    });

    console.log(`Worker started for queue: ${this.qName}`);
  }

  async stop() {
    if (this.worker) {
      console.log("Shutting down worker...");
      await this.worker.close();
      this.worker = null;
    }
  }
}

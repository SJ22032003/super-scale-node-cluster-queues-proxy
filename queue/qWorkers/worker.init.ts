import { Job, Worker } from "bullmq";

const MAIN_QUEUE_NAME = "clustring-node-queue";

const redisConnection = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

export class QWorker {
  private qName: string;
  private processJobFn: (job: Job) => Promise<void>;

  constructor(name: string, processJobFn: (job: Job) => Promise<void>) {
    this.qName = name;
    this.processJobFn = processJobFn;
  }

  async start() {
    new Worker(
      this.qName,
      async (job: Job) => {
        await this.processJobFn(job);
      },
      redisConnection
    );
  }
}

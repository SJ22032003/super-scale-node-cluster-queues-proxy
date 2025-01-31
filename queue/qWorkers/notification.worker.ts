import type { Job } from "bullmq";
import { QWorker } from "./worker.init";
import { TASK_COMPLETED_NOTIFICATION_Q } from "../qNames";


async function taskCompletedNotificationQ(job: Job) {
	setTimeout(() => {
		console.log("JOB COMPLETED", job.data);
		return Promise.resolve();
	}, 3000);
}

const qWorkerForTaskCompletedNotification = new QWorker(TASK_COMPLETED_NOTIFICATION_Q, taskCompletedNotificationQ);

export {
	qWorkerForTaskCompletedNotification,
}



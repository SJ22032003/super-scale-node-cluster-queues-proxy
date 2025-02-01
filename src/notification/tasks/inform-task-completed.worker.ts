import type { Job } from "bullmq";
import { QWorker } from "../../queue/worker.init";
import { NOTIFICATION_Q } from "../../queue/qNames";


async function taskCompletedNotificationQ(job: Job) {
	setTimeout(() => {
		console.log("JOB COMPLETED", job.data);
		return Promise.resolve();
	}, 3000);
}

const qWorkerForTaskCompletedNotification = new QWorker(NOTIFICATION_Q, taskCompletedNotificationQ);

export {
	qWorkerForTaskCompletedNotification,
}



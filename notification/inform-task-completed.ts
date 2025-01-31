import type { Job } from "bullmq";
import { QProducer } from "../queue/producer.init";
import { TASK_COMPLETED_NOTIFICATION_Q, TASK_COMPLETED_NOTIFICATION_Q_KEY } from "../queue/qNames";

export async function informTaskComplete(message: string) {
	const qProducer = new QProducer(TASK_COMPLETED_NOTIFICATION_Q).queue;
	await qProducer.add(TASK_COMPLETED_NOTIFICATION_Q_KEY, { message });
}


import type { Job } from "bullmq";
import { QProducer } from "../../queue/producer.init";
import { NOTIFICATION_Q, TASK_COMPLETED_NOTIFICATION_Q } from "../../queue/qNames";

const qProducer = new QProducer(NOTIFICATION_Q).queue;

export async function informTaskComplete(message: string) {
	await qProducer.add(TASK_COMPLETED_NOTIFICATION_Q, { message });
}


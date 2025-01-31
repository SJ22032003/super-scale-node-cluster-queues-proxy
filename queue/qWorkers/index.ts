import cluster from "node:cluster";
import { qWorkerForTaskCompletedNotification } from "./notification.worker";

if(cluster.isPrimary) {
	qWorkerForTaskCompletedNotification.start();
}
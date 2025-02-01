import cluster from "node:cluster";
import { qWorkerForTaskCompletedNotification } from "../notification/tasks/inform-task-completed.worker";

if(cluster.isPrimary) {
	qWorkerForTaskCompletedNotification.start();
}
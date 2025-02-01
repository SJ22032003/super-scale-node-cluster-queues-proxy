import { parentPort, isMainThread } from "node:worker_threads";
import { sum } from "../utils/sum";

interface IMessage {
	start: number;
	end: number;
}


if(!isMainThread) {
	parentPort?.on("message", (message: IMessage) => {
		const { start, end } = message;
		const result = sum(start, end);
		parentPort?.postMessage(result);
	});
}

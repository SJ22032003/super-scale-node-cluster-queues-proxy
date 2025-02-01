import { cpus } from "node:os";

export function chunkify(num: number): { start: number, end: number }[] {
	const totalCpus = cpus().length;
	const chunkSize = Math.ceil(num / totalCpus);
	const chunks = [];
	let start = 0;
	let end = chunkSize;
	for (let i = 0; i < totalCpus; i++) {
		chunks.push({ start, end });
		start = end;
		end = start + chunkSize;
	}
	return chunks;
}

export function sum(start: number, end: number): number {
	let sum = 0;
	for (let i = start; i < end; i++) {
		sum += i;
	}
	return sum;
}
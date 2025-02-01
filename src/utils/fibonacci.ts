export class Fibonacci {
	constructor() {}

	static calculateFibonacciValue(value: number): number {
		let s: number = 0;
		let returnValue: number = 0;
		if (value <= 0) {
			return 0;
		} else if (value == 1) {
			return 1;
		} else {
			return (this.calculateFibonacciValue(value - 1) + this.calculateFibonacciValue(value - 2));
		}

	}
 }

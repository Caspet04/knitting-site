export interface ITimer {
	start(): void;
	stop(): void;
	start_group(name: string): void;
	stop_group(): void;
	measure(name: string): void;
	start_measure(name: string): void;
	stop_measure(): void;
	print(): void;
}

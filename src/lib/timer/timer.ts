import type { ITimer } from './types';

type Times = Array<MeasureTimes | GroupTimes>;

type GroupTimes = {
	type: 'group';
	name: string;
	start: number;
	stop: number;
	elapsed: number;
	times: Times;
};

type MeasureTimes = {
	type: 'measure';
	name: string;
	start: number;
	stop: number;
	elapsed: number;
};

export class Timer implements ITimer {
	private start_time = NaN;
	private stop_time = NaN;
	private elapsed_time = NaN;

	private running = false;
	private times: Times = [];
	private groups: Array<GroupTimes> = [];
	private latest: null | MeasureTimes | GroupTimes = null;

	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	start(): void {
		if (this.running) throw new Error('Timer already running');

		this.start_time = Date.now();
		this.running = true;
	}

	stop(): void {
		if (!this.running) throw new Error('Timer not running');

		this.stop_time = Date.now();
		this.elapsed_time = this.stop_time - this.start_time;
		this.running = false;
	}

	start_group(name: string): void {
		if (!this.running) throw new Error('Timer not running');

		const group: GroupTimes = {
			type: 'group',
			name,
			start: Date.now(),
			stop: NaN,
			elapsed: NaN,
			times: []
		};

		if (this.groups.length == 0) {
			this.times.push(group);
		} else {
			this.groups.slice(-1)[0].times.push(group);
		}

		this.groups.push(group);
		this.latest = group;
	}

	stop_group(): void {
		if (!this.running) throw new Error('Timer not running');

		const group = this.groups.pop();
		if (group == null) throw new Error('Currently not in a group');

		group.stop = Date.now();
		group.elapsed = group.stop - group.start;
	}

	measure(name: string): void {
		if (!this.running) throw new Error('Timer not running');

		let last_stop: number;
		if (this.latest == null) {
			last_stop = this.start_time;
		} else if (this.latest.type == 'group') {
			last_stop = this.latest.start;
		} else {
			last_stop = this.latest.stop;
		}

		const now = Date.now();
		const measure: MeasureTimes = {
			type: 'measure',
			name,
			start: last_stop,
			stop: now,
			elapsed: now - last_stop
		};

		if (this.groups.length == 0) {
			this.times.push(measure);
		} else {
			this.groups.slice(-1)[0].times.push(measure);
		}

		this.latest = measure;
	}

	start_measure(name: string): void {
		if (!this.running) throw new Error('Timer not running');

		const measure: MeasureTimes = {
			type: 'measure',
			name,
			start: Date.now(),
			stop: NaN,
			elapsed: NaN
		};

		if (this.groups.length == 0) {
			this.times.push(measure);
		} else {
			this.groups.slice(-1)[0].times.push(measure);
		}

		this.latest = measure;
	}

	stop_measure(): void {
		if (!this.running) throw new Error('Timer not running');

		if (this.latest == null) {
			throw new Error('No groups or measurements exists');
		}

		if (this.latest.type != 'measure') {
			throw new Error('Latest action was not a start_measurement()');
		}

		this.latest.stop = Date.now();
		this.latest.elapsed = this.latest.stop - this.latest.start;
	}

	print(): void {
		if (this.running) throw new Error('Timer running');

		console.log(`Timer ${this.name} started`);
		this.print_times(this.times);
		console.log(`Total: ${this.elapsed_time} ms`);
	}

	private print_times(times: Times, depth = 1) {
		for (let i = 0; i < times.length; i++) {
			const time = times[i];
			this.print_depth(`${time.name}: ${time.elapsed} ms`, depth);

			if (time.type == 'group') {
				this.print_times(time.times, depth + 1);
			}
		}
	}

	private print_depth(message: string, depth: number) {
		if (depth == 0) console.log(`${message}`);
		else console.log(`${'--'.repeat(depth)} ${message}`);
	}
}

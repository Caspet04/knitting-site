import type { Chart } from '$lib/chart';
import type { StandardError } from '$lib/error/';
import type { User } from '@prisma/client';
import type { AsyncResult } from 'ts-async-results';

export interface ChartManager {
	/**
	 * Save the chart to the database, returns the id of the saved chart.
	 * @param {Chart} chart - the chart to save.
	 * @returns a result containing the id of the saved chart or an error.
	 */
	save_new_chart(user: User, chart: Chart): AsyncResult<string, StandardError>;

	/**
	 * Save the chart to the chart in the database with the id.
	 * @param {string} id - the id to look for.
	 * @param {Chart} chart - the chart to save.
	 * @returns a result containing nothing or an error.
	 */
	save_chart(
		user: User,
		id: string,
		chart: Chart
	): AsyncResult<null, StandardError>;

	/**
	 * Loads the chart from the database with the id.
	 * @param {string} id - the id to look for.
	 * @returns a result containing the chart or an error.
	 */
	load_chart(id: string): AsyncResult<Chart, StandardError>;

	/**
	 * Loads all the charts in the database.
	 * @returns a result containing the charts or an error.
	 */
	load_public_charts(): AsyncResult<Array<Chart>, StandardError>;

	/**
	 * Loads all the charts in the database.
	 * @returns a result containing the charts or an error.
	 */
	load_private_charts(user: User): AsyncResult<Array<Chart>, StandardError>;
}

export interface UserManager {
	register(
		username: string,
		password: string
	): AsyncResult<User, StandardError>;
	login(username: string, password: string): AsyncResult<User, StandardError>;
	delete(
		session: string,
		username: string,
		password: string
	): AsyncResult<null, StandardError>;
	get_by_session(session: string): AsyncResult<User, StandardError>;
}

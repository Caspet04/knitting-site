import type { Chart } from '$lib/chart';
import type { StandardError } from '$lib/error/';
import type { AsyncResult } from 'ts-async-results';

export interface DatabaseManager {
	/**
	 * Save the chart to the database, returns the id of the saved chart.
	 * @param {Chart} chart - the chart to save.
	 * @returns a result containing the id of the saved chart or an error.
	 */
	save_new_chart(chart: Chart): AsyncResult<string, StandardError>;

	/**
	 * Save the chart to the chart in the database with the id.
	 * @param {string} id - the id to look for.
	 * @param {Chart} chart - the chart to save.
	 * @returns a result containing nothing or an error.
	 */
	save_chart(id: string, chart: Chart): AsyncResult<null, StandardError>;

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
	load_charts(): AsyncResult<Array<Chart>, StandardError>;
}

import type { Chart } from '$lib/chart';
import type { StandardError } from '$lib/error/';
import type { AsyncResult } from 'ts-async-results';

// TODO: Consider renaming the Chart, IStandardError, etc to ChartLike, StandardErrorLike

export interface DatabaseManager {
	/**
	 * Save the chart to the database, returns the id of the saved chart.
	 * @param {Chart} chart - the chart to save.
	 * @returns the id of the saved chart.
	 */
	save_new_chart(chart: Chart): AsyncResult<string, StandardError>;
	save_chart(id: string, chart: Chart): AsyncResult<null, StandardError>;
	load_chart(id: string): AsyncResult<Chart, StandardError>;
}

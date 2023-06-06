import type { Stitch } from '$lib/assets/stitches';
import type { Chart } from './chart';

export interface ChartRendererConfig {
	selected_stitch?: Stitch;
}

/**
 * A chart of stitches that can have stitches be placed on it.
 */
export interface IChartRenderer {
	selected_stitch: Stitch;
	chart?: Chart;
	/**
	 * Place a single stitch in a specific location.
	 * @param x - the x coordinate.
	 * @param y - the y coordinate.
	 * @param stitch - the stitch to place.
	 */
	place_stitch(x: number, y: number, stitch: Stitch): void;

	/**
	 * Get a list of the stitches in the chart.
	 */
	get_stitches(): Stitch[];

	set_chart(chart: Chart): void;
	set_container(container: HTMLDivElement): void;
}

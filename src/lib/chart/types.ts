import type { Stitch } from '$lib/assets/stitches';

export interface ChartConfig {
	width: number;
	height: number;
	container: HTMLDivElement;
	selected_stitch?: Stitch;
	stitches?: Stitch[];
}

/**
 * A chart of stitches that can have stitches be placed on it.
 */
export interface IChart {
	selected_stitch: Stitch;
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
}

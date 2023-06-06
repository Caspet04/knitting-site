import Konva from 'konva';
import type { ChartRendererConfig, IChartRenderer } from './types';
import { Stitch, generate_konva_shape } from '$lib/assets/stitches';
import { Timer } from '$lib/timer';
import type { Chart } from './chart';
export {
	type Chart,
	chart_from_json_string,
	chart_to_json_string
} from './chart';

// TODO: Move into separate file

Konva.autoDrawEnabled = false;

const timer = new Timer('Renderer');

export class ChartRenderer implements IChartRenderer {
	public chart: Chart;
	private rendered_stitches: Array<Konva.Shape>;
	private cell_size: number;
	private stage: Konva.Stage;
	private grid_layer: Konva.Layer;
	private stitch_layer: Konva.Layer;

	public selected_stitch: Stitch;

	constructor({ chart, container, selected_stitch }: ChartRendererConfig) {
		timer.start();

		this.chart = chart;
		this.cell_size = Math.min(
			container.clientWidth / this.chart.width,
			container.clientHeight / this.chart.height
		);
		timer.measure('Calculated size');

		timer.start_group('Generating stitches');

		this.rendered_stitches = this.chart.stitches.map((stitch, i) =>
			generate_konva_shape(
				stitch,
				this.cell_size,
				i % this.chart.width,
				Math.floor(i / this.chart.height)
			)
		);
		timer.measure('Rendered stitches');

		this.selected_stitch = selected_stitch ?? Stitch.NO_STITCH;
		timer.stop_group();

		timer.start_group('Konva');
		this.stage = new Konva.Stage({
			container,
			width: this.cell_size * this.chart.width,
			height: this.cell_size * this.chart.height
		});
		timer.measure('Stage');

		// GRID LAYER
		timer.start_group('Grid layer');
		this.grid_layer = new Konva.Layer();
		timer.measure('Layer');

		this.stage.add(this.grid_layer);
		timer.measure('Add layer');

		this.init_grid_layer(this.grid_layer);
		timer.stop_group();

		// STITCH LAYER
		timer.start_group('Stitch layer');
		this.stitch_layer = new Konva.Layer({
			clearBeforeDraw: false
		});
		timer.measure('Layer');

		this.stage.add(this.stitch_layer);
		timer.measure('Add layer');

		this.init_stitch_layer(this.stitch_layer);
		timer.stop_group();

		this.stage.on('mousedown', (event) => {
			// Check if it is not left click
			if (event.evt.button !== 0) return;

			const mouse_position = this.stage.getRelativePointerPosition();
			const x = Math.floor(mouse_position.x / this.cell_size);
			const y = Math.floor(mouse_position.y / this.cell_size);

			this.place_stitch(x, y, this.selected_stitch);
		});
		timer.stop_group();

		container.style.width = 'min-content';
		container.style.height = 'min-content';

		timer.stop();
		// timer.print();
	}

	private init_grid_layer(grid_layer: Konva.Layer) {
		for (let x = 0; x < this.chart.width + 1; x++) {
			grid_layer.add(
				new Konva.Line({
					x: x * this.cell_size,
					points: [0, 0, 0, this.stage.height()],
					stroke: 'rgba(0, 0, 0, 0.2)',
					strokeWidth: 1
				})
			);
		}
		timer.measure('Vertical lines');

		for (let y = 0; y < this.chart.height + 1; y++) {
			grid_layer.add(
				new Konva.Line({
					y: y * this.cell_size,
					points: [0, 0, this.stage.width(), 0],
					stroke: 'rgba(0, 0, 0, 0.2)',
					strokeWidth: 1
				})
			);
		}
		timer.measure('Horizontal lines');

		grid_layer.batchDraw();
		timer.measure('Batch draw');
	}

	private init_stitch_layer(stitch_layer: Konva.Layer) {
		stitch_layer.add(...this.rendered_stitches);
		timer.measure('Add rendered');

		stitch_layer.batchDraw();
		timer.measure('Batch draw');
	}

	place_stitch(x: number, y: number, stitch: Stitch): void {
		const index = x + y * this.chart.width;
		this.chart.stitches[index] = stitch;

		this.rendered_stitches[index].destroy();
		this.stitch_layer.clear({
			x: x * this.cell_size,
			y: y * this.cell_size,
			width: this.cell_size,
			height: this.cell_size
		});

		this.rendered_stitches[index] = generate_konva_shape(
			stitch,
			this.cell_size,
			x,
			y
		);
		this.stitch_layer.add(this.rendered_stitches[index]);
		this.rendered_stitches[index].draw();
	}

	get_stitches(): Stitch[] {
		return [...this.chart.stitches];
	}
}

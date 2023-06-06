import Konva from 'konva';
import type { ChartRendererConfig, IChartRenderer } from './types';
import { Stitch, generate_konva_shape } from '$lib/assets/stitches';
import type { Chart } from '.';

Konva.autoDrawEnabled = false;

type Contained = {
	container: HTMLDivElement;
	cell_size: number;
	stage: Konva.Stage;
	grid_layer: Konva.Layer;
	stitch_layer: Konva.Layer;
	rendered_stitches: Array<Konva.Shape>;
};

export class ChartRenderer implements IChartRenderer {
	public get chart(): Chart | undefined {
		return this.#chart;
	}
	public selected_stitch: Stitch;

	#chart?: Chart;
	private contained?: Contained;

	constructor(
		{ selected_stitch }: ChartRendererConfig = {
			selected_stitch: Stitch.NO_STITCH
		}
	) {
		this.selected_stitch = selected_stitch ?? Stitch.NO_STITCH;
	}

	public set_chart(chart: Chart): void {
		// TODO: Add width, height updates
		this.#chart = chart;
	}

	public set_container(container: HTMLDivElement): void {
		if (this.chart == null) throw new Error('Chart is not set');

		const cell_size = Math.min(
			container.clientWidth / this.chart.width,
			container.clientHeight / this.chart.height
		);

		const rendered_stitches = this.chart.stitches.map((stitch, i) => {
			if (this.chart == null) throw new Error('Chart is not set');

			return generate_konva_shape(
				stitch,
				cell_size,
				i % this.chart.width,
				Math.floor(i / this.chart.height)
			);
		});

		const stage = new Konva.Stage({
			container,
			width: cell_size * this.chart.width,
			height: cell_size * this.chart.height
		});

		// GRID LAYER
		const grid_layer = new Konva.Layer();
		stage.add(grid_layer);
		this.init_grid_layer(grid_layer, cell_size, stage);

		// STITCH LAYER
		const stitch_layer = new Konva.Layer({
			clearBeforeDraw: false
		});
		stage.add(stitch_layer);
		this.init_stitch_layer(stitch_layer, rendered_stitches);

		stage.on('mousedown', (event) => {
			// Check if it is not left click
			if (event.evt.button !== 0) return;

			const mouse_position = stage.getRelativePointerPosition();
			const x = Math.floor(mouse_position.x / cell_size);
			const y = Math.floor(mouse_position.y / cell_size);

			this.place_stitch(x, y, this.selected_stitch);
		});

		container.style.width = 'min-content';
		container.style.height = 'min-content';

		this.contained = {
			container,
			cell_size,
			stage,
			grid_layer,
			stitch_layer,
			rendered_stitches
		};
	}

	private init_grid_layer(
		grid_layer: Konva.Layer,
		cell_size: number,
		stage: Konva.Stage
	) {
		if (this.chart == null) throw new Error('Chart is not set');

		for (let x = 0; x < this.chart.width + 1; x++) {
			grid_layer.add(
				new Konva.Line({
					x: x * cell_size,
					points: [0, 0, 0, stage.height()],
					stroke: 'rgba(0, 0, 0, 0.2)',
					strokeWidth: 1
				})
			);
		}

		for (let y = 0; y < this.chart.height + 1; y++) {
			grid_layer.add(
				new Konva.Line({
					y: y * cell_size,
					points: [0, 0, stage.width(), 0],
					stroke: 'rgba(0, 0, 0, 0.2)',
					strokeWidth: 1
				})
			);
		}

		grid_layer.batchDraw();
	}

	private init_stitch_layer(
		stitch_layer: Konva.Layer,
		rendered_stitches: Array<Konva.Shape>
	) {
		stitch_layer.add(...rendered_stitches);
		stitch_layer.batchDraw();
	}

	place_stitch(x: number, y: number, stitch: Stitch): void {
		if (this.chart == null) throw new Error('Chart is not set');

		if (this.contained == null) throw new Error('The container is not set');

		const index = x + y * this.chart.width;
		this.chart.stitches[index] = stitch;

		this.contained.rendered_stitches[index].destroy();
		this.contained.stitch_layer.clear({
			x: x * this.contained.cell_size,
			y: y * this.contained.cell_size,
			width: this.contained.cell_size,
			height: this.contained.cell_size
		});

		this.contained.rendered_stitches[index] = generate_konva_shape(
			stitch,
			this.contained.cell_size,
			x,
			y
		);
		this.contained.stitch_layer.add(this.contained.rendered_stitches[index]);
		this.contained.rendered_stitches[index].draw();
	}

	get_stitches(): Stitch[] {
		if (this.chart == null) throw new Error('Chart is not set');

		return [...this.chart.stitches];
	}
}

import Konva from 'konva';
import type { ChartConfig, IChart } from './types';
import { Stitch, generate_konva_shape } from '$lib/assets/stitches';

// TODO: Make it possible to set each stitch to an actual stitch
// TODO: Test out pixijs or another library

Konva.autoDrawEnabled = false;

export class Chart implements IChart {
	private width: number;
	private height: number;
	private stitches: Array<Stitch>;
	private rendered_stitches: Array<Konva.Shape>;
	private cell_size: number;
	private stage: Konva.Stage;
	private grid_layer: Konva.Layer;
	private stitch_layer: Konva.Layer;

	public selected_stitch: Stitch;

	constructor({ width, height, stitches, container, selected_stitch }: ChartConfig) {
		if (stitches != undefined && stitches.length < width * height) {
			throw new Error('List of stitches length does not match the dimensions of the chart.');
		}

		this.width = width;
		this.height = height;
		this.cell_size = Math.min(
			container.clientWidth / this.width,
			container.clientHeight / this.height
		);

		this.stitches = stitches ?? new Array(this.width * this.height).fill(Stitch.KNIT);
		this.rendered_stitches = this.stitches.map((stitch, i) =>
			generate_konva_shape(stitch, this.cell_size, i % this.width, Math.floor(i / this.height))
		);
		this.selected_stitch = selected_stitch ?? Stitch.NO_STITCH;

		this.stage = new Konva.Stage({
			container,
			width: this.cell_size * this.width,
			height: this.cell_size * this.height
		});
		this.grid_layer = this.create_grid_layer();
		this.stitch_layer = this.create_stitch_layer();
		this.stage.add(this.grid_layer, this.stitch_layer);

		this.stage.on('mousedown', (event) => {
			// Check if it is not left click
			if (event.evt.button !== 0) return;

			const mouse_position = this.stage.getRelativePointerPosition();
			const x = Math.floor(mouse_position.x / this.cell_size);
			const y = Math.floor(mouse_position.y / this.cell_size);

			this.place_stitch(x, y, this.selected_stitch);
		});

		container.style.width = 'min-content';
		container.style.height = 'min-content';
	}

	private create_grid_layer(): Konva.Layer {
		const grid_layer = new Konva.Layer();

		for (let x = 0; x < this.width + 1; x++) {
			grid_layer.add(
				new Konva.Line({
					x: x * this.cell_size,
					points: [0, 0, 0, this.stage.height()],
					stroke: 'rgba(0, 0, 0, 0.2)',
					strokeWidth: 1
				})
			);
		}

		for (let y = 0; y < this.height + 1; y++) {
			grid_layer.add(
				new Konva.Line({
					y: y * this.cell_size,
					points: [0, 0, this.stage.width(), 0],
					stroke: 'rgba(0, 0, 0, 0.2)',
					strokeWidth: 1
				})
			);
		}

		grid_layer.batchDraw();
		return grid_layer;
	}

	private create_stitch_layer(): Konva.Layer {
		const stitch_layer = new Konva.Layer({
			clearBeforeDraw: false
		});

		stitch_layer.add(...this.rendered_stitches);

		stitch_layer.batchDraw();
		return stitch_layer;
	}

	place_stitch(x: number, y: number, stitch: Stitch): void {
		const index = x + y * this.width;
		this.stitches[index] = stitch;

		this.rendered_stitches[index].destroy();
		this.stitch_layer.clear({
			x: x * this.cell_size,
			y: y * this.cell_size,
			width: this.cell_size,
			height: this.cell_size
		});

		this.rendered_stitches[index] = generate_konva_shape(stitch, this.cell_size, x, y);
		this.stitch_layer.add(this.rendered_stitches[index]);
		this.rendered_stitches[index].draw();
	}

	get_stitches(): Stitch[] {
		return [...this.stitches];
	}
}

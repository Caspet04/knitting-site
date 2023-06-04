import { Stitch, stitch_data_list } from '.';
import colors from '../colors.json';
import Konva from 'konva';

const shapes = new Array<Konva.Shape>(stitch_data_list.length);
for (let i = 0; i < shapes.length; i++) {
	const stitch_data = stitch_data_list[i];
	if (stitch_data.type == 'empty') {
		shapes[i] = new Konva.Rect({
			x: 0,
			y: 0,
			fill: 'transparent'
		});
	} else if (stitch_data.type == 'filled') {
		shapes[i] = new Konva.Rect({
			x: 0,
			y: 0,
			fill: colors.stitches.filled[stitch_data.filled]
		});
	} else if (stitch_data.type == 'image') {
		Konva.Image.fromURL(stitch_data.image, (image) => {
			shapes[i] = image;
		});
	}
}

export function generate_konva_shape(
	stitch: Stitch,
	cell_size: number,
	x: number,
	y: number
): Konva.Shape {
	return shapes[stitch].clone({
		x: x * cell_size,
		y: y * cell_size,
		width: cell_size,
		height: cell_size
	});
}

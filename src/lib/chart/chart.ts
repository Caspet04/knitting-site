import type { Stitch } from '$lib/assets/stitches';
import { standard_error, type StandardError } from '$lib/error';
import { Err, Ok, type Result } from 'ts-results';

export interface Chart {
	readonly id: string;
	readonly name: string;
	readonly width: number;
	readonly height: number;
	readonly stitches: Array<Stitch>;
}

export function chart_from_json_string(
	string: string
): Result<Chart, StandardError> {
	const chart = JSON.parse(string);

	if (typeof chart.id !== 'string')
		return Err(standard_error(400, 'id is not string'));

	if (typeof chart.name !== 'string')
		return Err(standard_error(400, 'name is not string'));

	if (typeof chart.width !== 'number')
		return Err(standard_error(400, 'width is not number'));

	if (typeof chart.height !== 'number')
		return Err(standard_error(400, 'height is not number'));

	if (chart.stitches instanceof Array)
		return Err(standard_error(400, 'stitches is not an array'));

	if (typeof chart.stitches[0] !== 'number')
		return Err(standard_error(400, 'stitches does not consists of numbers'));

	return Ok(chart);
}

export function chart_to_json_string(chart: Chart): string {
	return JSON.stringify(chart);
}

export function chart_from_object(object: any): Result<Chart, StandardError> {
	if (typeof object.id !== 'string')
		return Err(standard_error(400, 'id is not string'));

	if (typeof object.name !== 'string')
		return Err(standard_error(400, 'name is not string'));

	if (typeof object.width !== 'number')
		return Err(standard_error(400, 'width is not number'));

	if (typeof object.height !== 'number')
		return Err(standard_error(400, 'height is not number'));

	if (!(object.stitches instanceof Array))
		return Err(standard_error(400, 'stitches is not an array'));

	if (object.stitches.length != object.width * object.height)
		return Err(standard_error(400, 'stitches has the wrong dimensions'));

	if (typeof object.stitches[0] !== 'number')
		return Err(standard_error(400, 'stitches does not consists of numbers'));

	return Ok(object);
}

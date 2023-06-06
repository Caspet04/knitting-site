import type { Chart } from '$lib/chart';
import { AsyncResultWrapper, type AsyncResult } from 'ts-async-results';
import type { ChartManager } from './types';
import type { User } from '@prisma/client';
import { CODED_ERROR, type StandardError, standard_error } from '$lib/error';
import { Err, Ok, Result } from 'ts-results';
import * as crypto from 'crypto';
import { database, wrap_database_call } from '.';

export class SqliteChartManager implements ChartManager {
	save_new_chart(user: User, chart: Chart): AsyncResult<string, StandardError> {
		return new AsyncResultWrapper<string, StandardError>(
			async (): Promise<Result<string, StandardError>> => {
				const id = crypto.randomUUID();
				const stitches: Buffer = Buffer.from(chart.stitches);

				const create_result = await wrap_database_call(
					database.user.update({
						where: { id: user.id },
						data: {
							charts: {
								create: {
									id,
									name: chart.name,
									width: chart.width,
									height: chart.height,
									stitches,
									public: chart.public
								}
							}
						}
					})
				).resolve();

				if (create_result.err) {
					return Err(create_result.val);
				}

				return Ok(id);
			}
		);
	}

	save_chart(
		user: User,
		id: string,
		chart: Chart
	): AsyncResult<null, StandardError> {
		return new AsyncResultWrapper<null, StandardError>(
			async (): Promise<Result<null, StandardError>> => {
				const find_result = await wrap_database_call(
					database.chart.findUnique({ where: { id } })
				).resolve();

				if (find_result.err) return Err(find_result.val);

				if (find_result.val == null) {
					return Err(
						standard_error(400, 'Cannot save to id ' + id + ', does not exist')
					);
				}

				if (find_result.val.owner_id != user.id)
					return Err(
						standard_error(
							403,
							'Cannot save to id ' + id + ', is not owned by you'
						)
					);

				const stitches: Buffer = Buffer.from(chart.stitches);
				const update_result = await wrap_database_call(
					database.chart.update({
						where: { id },
						data: { stitches, name: chart.name }
					})
				).resolve();

				if (update_result.err) {
					return Err(update_result.val);
				}

				return Ok(null);
			}
		);
	}

	load_chart(id: string): AsyncResult<Chart, StandardError> {
		return new AsyncResultWrapper<Chart, StandardError>(
			async (): Promise<Result<Chart, StandardError>> => {
				const find_result = await wrap_database_call(
					database.chart.findUnique({ where: { id } })
				).resolve();

				if (find_result.err) return Err(find_result.val);

				if (find_result.val == null) {
					return Err(
						standard_error(400, 'Cannot load chart ' + id + ', does not exist')
					);
				}

				const chart = find_result.val;
				return Ok({
					id: chart.id,
					width: chart.width,
					height: chart.height,
					name: chart.name,
					stitches: [...chart.stitches],
					public: chart.public
				});
			}
		);
	}

	load_public_charts(): AsyncResult<Array<Chart>, StandardError> {
		return new AsyncResultWrapper<Array<Chart>, StandardError>(
			async (): Promise<Result<Array<Chart>, StandardError>> => {
				const find_result = await wrap_database_call(
					database.chart.findMany({ where: { public: true } })
				).resolve();

				if (find_result.err) return Err(find_result.val);

				const charts = find_result.val;
				return Ok(
					charts.map((chart) => ({
						id: chart.id,
						width: chart.width,
						height: chart.height,
						name: chart.name,
						stitches: [...chart.stitches],
						public: chart.public
					}))
				);
			}
		);
	}

	load_private_charts(user: User): AsyncResult<Array<Chart>, StandardError> {
		return new AsyncResultWrapper<Array<Chart>, StandardError>(
			async (): Promise<Result<Array<Chart>, StandardError>> => {
				const find_result = await wrap_database_call(
					database.chart.findMany({ where: { owner_id: user.id } })
				).resolve();

				if (find_result.err) return Err(find_result.val);

				const charts = find_result.val;
				return Ok(
					charts.map((chart) => ({
						id: chart.id,
						width: chart.width,
						height: chart.height,
						name: chart.name,
						stitches: [...chart.stitches],
						public: chart.public
					}))
				);
			}
		);
	}
}

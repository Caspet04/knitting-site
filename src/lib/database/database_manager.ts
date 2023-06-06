import type { Chart } from '$lib/chart';
import { AsyncResultWrapper, type AsyncResult } from 'ts-async-results';
import type { DatabaseManager } from './types';
import { PrismaClient } from '@prisma/client';
import { CODED_ERROR, type StandardError, standard_error } from '$lib/error';
import { Err, Ok, Result } from 'ts-results';
import * as crypto from 'crypto';

function wrap_database_call<T>(
	promise: Promise<T>
): AsyncResult<T, StandardError> {
	return new AsyncResultWrapper<T, StandardError>(async () =>
		promise
			.then((value: T): Result<T, StandardError> => Ok(value))
			.catch((): Result<T, StandardError> => Err(CODED_ERROR.database_error))
	);
}

export class SqliteDatabaseManager implements DatabaseManager {
	private database: PrismaClient;

	constructor() {
		this.database = new PrismaClient();
	}

	save_new_chart(chart: Chart): AsyncResult<string, StandardError> {
		return new AsyncResultWrapper<string, StandardError>(
			async (): Promise<Result<string, StandardError>> => {
				const id = crypto.randomUUID();
				const stitches: Buffer = Buffer.from(chart.stitches);

				const create_result = await wrap_database_call(
					this.database.chart.create({
						data: {
							id,
							name: chart.name,
							width: chart.width,
							height: chart.height,
							stitches
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

	save_chart(id: string, chart: Chart): AsyncResult<null, StandardError> {
		return new AsyncResultWrapper<null, StandardError>(
			async (): Promise<Result<null, StandardError>> => {
				const find_result = await wrap_database_call(
					this.database.chart.findUnique({ where: { id } })
				).resolve();

				if (find_result.err) return Err(find_result.val);

				if (find_result.val == null) {
					return Err(
						standard_error(400, 'Cannot save to id ' + id + ', does not exist')
					);
				}

				// TODO: Check if the owner is the user that saves

				const stitches: Buffer = Buffer.from(chart.stitches);
				const update_result = await wrap_database_call(
					this.database.chart.update({
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
					this.database.chart.findUnique({ where: { id } })
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
					stitches: [...chart.stitches]
				});
			}
		);
	}

	load_charts(): AsyncResult<Array<Chart>, StandardError> {
		return new AsyncResultWrapper<Array<Chart>, StandardError>(
			async (): Promise<Result<Array<Chart>, StandardError>> => {
				const find_result = await wrap_database_call(
					this.database.chart.findMany()
				).resolve();

				if (find_result.err) return Err(find_result.val);

				const charts = find_result.val;
				return Ok(
					charts.map((chart) => ({
						id: chart.id,
						width: chart.width,
						height: chart.height,
						name: chart.name,
						stitches: [...chart.stitches]
					}))
				);
			}
		);
	}
}

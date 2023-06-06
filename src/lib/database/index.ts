import { PrismaClient } from '@prisma/client';
import { SqliteChartManager } from './chart_manager';
import type { ChartManager, UserManager } from './types';
import { AsyncResultWrapper, type AsyncResult } from 'ts-async-results';
import { CODED_ERROR, type StandardError } from '$lib/error';
import { Err, Ok, type Result } from 'ts-results';
import { SqliteUserManager } from './user_manager';

export const chart_manager: ChartManager = new SqliteChartManager();
export const user_manager: UserManager = new SqliteUserManager();

export const database = new PrismaClient();

export function wrap_database_call<T>(
	promise: Promise<T>
): AsyncResult<T, StandardError> {
	return new AsyncResultWrapper<T, StandardError>(async () =>
		promise
			.then((value: T): Result<T, StandardError> => Ok(value))
			.catch((): Result<T, StandardError> => Err(CODED_ERROR.database_error))
	);
}

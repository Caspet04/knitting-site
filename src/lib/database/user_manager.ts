import type { StandardError } from '$lib/error';
import type { User } from '@prisma/client';
import { AsyncResultWrapper, type AsyncResult } from 'ts-async-results';
import type { UserManager } from './types';
import { database, wrap_database_call } from '.';
import { Err, Ok, Result } from 'ts-results';
import * as crypto from 'crypto';

export class SqliteUserManager implements UserManager {
	register(
		username: string,
		password: string
	): AsyncResult<User, StandardError> {
		return new AsyncResultWrapper(
			async (): Promise<Result<User, StandardError>> => {
				const find_result = await wrap_database_call(
					database.user.findUnique({
						where: { username }
					})
				).resolve();
				if (find_result.err) return find_result;

				const user = find_result.val;
				if (user != null) {
					return Err({
						code: 400,
						message: 'Username used by another user'
					});
				}

				const salt = crypto.randomBytes(16).toString('hex');
				const hash = this.hash_password(password, salt);
				const session = this.generate_uid();

				const create_result = await wrap_database_call(
					database.user.create({
						data: {
							username,
							salt,
							hash,
							session
						}
					})
				).resolve();
				if (create_result.err) return create_result;

				return Ok(create_result.val);
			}
		);
	}

	login(username: string, password: string): AsyncResult<User, StandardError> {
		return new AsyncResultWrapper(
			async (): Promise<Result<User, StandardError>> => {
				const find_result = await wrap_database_call(
					database.user.findUnique({
						where: { username }
					})
				).resolve();
				if (find_result.err) return find_result;

				const user = find_result.val;
				if (user == null) {
					return Err({
						code: 400,
						message: 'Username does not exists'
					});
				}

				const new_hash = this.hash_password(password, user.salt);
				if (user.hash != new_hash) {
					return Err({
						code: 400,
						message: 'Password is incorrect'
					});
				}

				const session = this.generate_uid();

				const update_result = await wrap_database_call(
					database.user.update({
						where: { id: user.id },
						data: { session }
					})
				).resolve();
				if (update_result.err) return update_result;

				return Ok(update_result.val);
			}
		);
	}

	delete(
		session: string,
		username: string,
		password: string
	): AsyncResult<null, StandardError> {
		return new AsyncResultWrapper(
			async (): Promise<Result<null, StandardError>> => {
				const get_result = await this.get_by_session(session).resolve();
				if (get_result.err) return Err(get_result.val);

				const user = get_result.val;

				if (user.username != username)
					return Err({
						code: 400,
						message: 'Confirmation credentials does not match'
					});

				const hash = this.hash_password(password, user.salt);
				if (user.hash != hash)
					return Err({
						code: 400,
						message: 'Confirmation credentials does not match'
					});

				const delete_result = await wrap_database_call(
					database.user.delete({
						where: { id: user.id }
					})
				).resolve();
				if (delete_result.err) return delete_result;

				return Ok(null);
			}
		);
	}

	get_by_session(session: string): AsyncResult<User, StandardError> {
		return new AsyncResultWrapper<User, StandardError>(
			async (): Promise<Result<User, StandardError>> => {
				const database_result = await wrap_database_call(
					database.user.findUnique({
						where: { session }
					})
				).resolve();
				if (database_result.err) return Err(database_result.val);

				if (database_result.val == undefined) {
					return Err({
						code: 400,
						message: 'The proved does not exist'
					});
				}

				return Ok({
					username: database_result.val.username,
					session: database_result.val.session,
					id: database_result.val.id,
					salt: database_result.val.salt,
					hash: database_result.val.hash
				});
			}
		);
	}

	private hash_password(password: string, salt: string): string {
		return crypto
			.pbkdf2Sync(password, salt, 1000, 64, 'sha512')
			.toString('hex');
	}

	private generate_uid(): string {
		return crypto.randomUUID();
	}
}

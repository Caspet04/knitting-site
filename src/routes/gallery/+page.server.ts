import type { PageServerLoad } from './$types';
import { database } from '$lib/database';

export const load: PageServerLoad = async () => {
	const load_result = await database.load_charts().resolve();
	if (load_result.err) return { err: load_result.val };

	return {
		charts: load_result.val
	};
};

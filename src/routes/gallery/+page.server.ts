import type { PageServerLoad } from './$types';
import { chart_manager } from '$lib/database';
import type { Chart } from '$lib/chart';

export const load: PageServerLoad = async ({ locals }) => {
	const load_public_result = await chart_manager.load_public_charts().resolve();
	if (load_public_result.err) return { err: load_public_result.val };

	let private_charts: Array<Chart> | null = null;
	if (locals.user != null) {
		const load_private_result = await chart_manager
			.load_private_charts(locals.user)
			.resolve();
		if (load_private_result.err) return { err: load_private_result.val };

		private_charts = load_private_result.val;
	}

	return {
		public_charts: load_public_result.val,
		private_charts
	};
};

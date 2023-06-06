import { chart_from_object } from '$lib/chart/chart';
import { chart_manager } from '$lib/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (locals.user == null) {
		return json(
			{
				code: 401,
				message: 'Cannot save chart while not logged in'
			},
			{ status: 401 }
		);
	}
	const object = await request.json();
	const chart_result = chart_from_object(object);
	if (chart_result.err) {
		return json(chart_result.val, { status: 400 });
	}

	const chart = chart_result.val;

	if (params.id == 'unsaved') {
		const save_result = await chart_manager
			.save_new_chart(locals.user, chart)
			.resolve();
		if (save_result.err) return json(save_result.val, { status: 400 });

		return json({ redirect: '/editor/' + save_result.val }, { status: 200 });
	}

	const save_result = await chart_manager
		.save_chart(locals.user, params.id, chart)
		.resolve();
	if (save_result.err) return json(save_result.val, { status: 400 });

	return json({}, { status: 200 });
};

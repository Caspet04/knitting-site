import { chart_from_object } from '$lib/chart/chart';
import { database } from '$lib/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
	const object = await request.json();
	const chart_result = chart_from_object(object);
	if (chart_result.err) {
		return json(chart_result.val, { status: 400 });
	}

	const chart = chart_result.val;

	if (params.id == 'unsaved') {
		const save_result = await database.save_new_chart(chart).resolve();
		if (save_result.err) return json(save_result.val, { status: 400 });

		return json({ redirect: '/editor/' + save_result.val }, { status: 200 });
	}

	const save_result = await database.save_chart(params.id, chart).resolve();
	if (save_result.err) return json(save_result.val, { status: 400 });

	return json({}, { status: 200 });
};

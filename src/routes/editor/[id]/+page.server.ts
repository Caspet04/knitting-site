import type { PageServerLoad } from './$types';
import { chart_manager } from '$lib/database';
import { Stitch } from '$lib/assets/stitches';
import type { Chart } from '$lib/chart';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id == 'unsaved') {
		const chart: Chart = {
			id: params.id,
			name: 'Unnamed Chart',
			width: 100,
			height: 100,
			stitches: new Array<Stitch>(100 * 100).fill(Stitch.KNIT),
			public: false
		};
		return {
			chart
		};
	}

	const load_result = await chart_manager.load_chart(params.id).resolve();
	if (load_result.err) {
		return {
			err: load_result.val
		};
	}

	const chart: Chart = {
		id: load_result.val.id,
		name: load_result.val.name,
		width: load_result.val.width,
		height: load_result.val.height,
		public: load_result.val.public,
		stitches: [...load_result.val.stitches]
	};
	return {
		chart
	};
};

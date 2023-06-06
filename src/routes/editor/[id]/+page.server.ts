import type { PageServerLoad } from './$types';
import { database } from '$lib/database';
import { Stitch } from '$lib/assets/stitches';

// TODO: Add ability to rename charts
// TODO: Add gallery
// TODO: Add login system
// TODO: Add ownership checks for saves
// TODO: Add ownership checks for gallery and viewing charts, unless public

export const load: PageServerLoad = async ({ params }) => {
	if (params.id == 'unsaved') {
		return {
			chart: {
				id: params.id,
				name: 'Unnamed Chart',
				width: 100,
				height: 100,
				stitches: new Array<Stitch>(100 * 100).fill(Stitch.KNIT)
			}
		};
	}

	const load_result = await database.load_chart(params.id).resolve();
	if (load_result.err) {
		return {
			err: load_result.val
		};
	}

	return {
		chart: load_result.val
	};
};
